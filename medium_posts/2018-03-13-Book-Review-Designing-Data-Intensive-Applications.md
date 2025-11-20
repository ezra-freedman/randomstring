---
title: Book Review: Designing Data-Intensive Applications
author: Eric Silberstein
date: 2018-03-13T14:28:02.488Z
url: https://medium.com/random-string/book-review-designing-data-intensive-applications-a7b234046e77
---

I just finished Martin Kleppmann’s book “[Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.](https://dataintensive.net/)” Four things I loved about the book:

![](./medium_posts/images/Book-Review-Designing-Data-Intensive-Applications/1_pcXuRzjLGc5NhtqaoKgBog.png)

### It’s holistic

I’ve been part of creating and maintaining three long-lasting software products that rely on relational databases. That’s given me firsthand experience with how databases perform in production and how schemas evolve over time. In contrast, my understanding of techniques like map reduce comes only from reading and hello world tutorials. There are an overwhelming number of data products and concepts out there. It’s hard to grasp the big picture and even harder to understand tradeoffs. Kleppmann does an outstanding job of explaining a wide range of concepts from relational databases to stream processing. He provides historical context, realistic examples and extensive citations.

### It’s balanced

When you have a hammer everything looks like a nail. Some experts are overly committed to one architecture because it’s what they know or they have a horse in the race. That’s not this book. Kleppmann starts with the premise that there is no one-size-fits-all solution. He explores the motivations behind various architectures and the problems those architectures introduce.

### Products galore

Kleppmann describes a large number of open-source and commercial products and seems to have direct experience with most of them. So in addition to all the great conceptual information, the book is also a practical guide to selecting system components. If you need a distributed system coordination service, a database capable of leaderless replication, a language-independent efficient data encoding format, a log-based streaming system or any of thirty other categories you can start with the products discussed in the book. (For those four categories: ZooKeeper, etcd; DynamoDB, Cassandra, Riak, Voldemort; Protocol Buffers, Thrift, Avro; Kafka, Kinesis Streams, DistributedLog.)

### Correctness

If the book accomplished everything above at a broad-brush level it would already be useful. But what makes it incredible, and credible, is that Kleppmann illustrates concepts with detailed sequences. These sequences demonstrate how correct state is guaranteed or incorrect state can arise under specific algorithms and conditions. This level of precision is like the difference between vaguely attributing a bug to a timing issue and determining concise steps to reproduce. The former is slightly useful and potentially wrong, the latter is the critical first step in a reliable fix.

Here’s an example from the chapter on transactions. Kleppmann describes an algorithm called serializable snapshot isolation and provides the diagram below. This diagram, which is one of dozens of similar figures in the book, shows that transaction 43 is aborted when it tries to commit. This is because the transaction read information that was subsequently changed by transaction 42. Since transaction 42 successfully commits before transaction 43 tries to commit, transaction 43 must abort. The diagram shows why the abort is necessary for correctness in a way that would never come across in a hand-wavy description. (On the topic of transactions and isolation levels, even if you never plan to work with anything other than a single instance relational database, it’s still worth reading this book just for the transactions chapter.)

![](./medium_posts/images/Book-Review-Designing-Data-Intensive-Applications/1_d3W-ZnziFi4QrT5QA8zEEw.png)

Figure 7–11 from “Designing Data-Intensive Applications”

