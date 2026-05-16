---
title: Notes on shutting down gracefully
date: "2026-05-02"
---

Lorem ipsum. This entire blog post is AI slop and just being used as a placeholder to design around.

## The handshake

The contract between Kubernetes and your process is small but easy to misread. When a pod is being terminated the kubelet sends `SIGTERM`. You get `terminationGracePeriodSeconds` (default: 30) before it's escalated to `SIGKILL`. That is the whole contract. Everything else — load balancer deregistration, in-flight requests, pending writes — is your problem to solve.

For a Go service the minimum workable shape is something like:

```go
func main() {
    ctx, stop := signal.NotifyContext(
        context.Background(),
        os.Interrupt, syscall.SIGTERM,
    )
    defer stop()

    srv := newServer()
    go srv.Run(ctx)

    <-ctx.Done()
    srv.Shutdown(15 * time.Second)
}
```

That's three lines doing real work. `NotifyContext` turns OS signals into a context cancellation; `<-ctx.Done()` waits for it; `Shutdown` stops accepting connections and gives in-flight ones a deadline. Everything else is bookkeeping.

## Drain order matters

The trick that's saved me the most pages is reversing the obvious order. *Stop accepting new traffic first; finish in-flight work second.* If you flip those, you'll watch your latency tail spike for the entire drain window — every new request hitting the load balancer is racing your shutdown.

The way you actually do this in Kubernetes is the `preStop` hook. `SIGTERM` and endpoint removal race each other; a small sleep in `preStop` guarantees the endpoint removal wins. Five seconds is usually enough; ten is generous.

## What still gets me

Background jobs. A goroutine pulling from a queue doesn't see `SIGTERM` — it sees a closed context, eventually, if you wired it up. If you didn't, your worker happily picks up a 30-second job at second 28 of the grace window. The kubelet sends `SIGKILL`. The job is lost, or worse, half-done.

Two patterns I reach for: (1) every long-lived loop accepts the same shutdown context and checks it before pulling new work; (2) the queue's "in flight" lease is short enough that a redelivery on `SIGKILL` is acceptable.

## Testing it

Three years of writing services and I still write this wrong sometimes. The good news: it's the most testable part of an application. A unit test that signals the process and asserts everything shut down in order is twenty lines. The integration test — spin up the service, send traffic, `kubectl delete pod`, assert no 5xx — is a hundred. Both are worth it.

*If you've made it this far and you write Go services, the homework is: open your `main.go` and check the signal handling. Mine was wrong last week.*
