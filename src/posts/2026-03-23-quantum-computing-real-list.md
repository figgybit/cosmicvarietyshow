---
title: "The Real List"
subtitle: "What a Quantum Computer Can Actually Do"
date: 2026-03-23T09:00:00
tags: ["posts", "feynman", "science", "high-impact", "new-physics"]
excerpt: "Everyone talks about quantum computing. Almost nobody knows what it is actually good for. The real list is shorter than the hype suggests and more interesting than the headlines."
author: "Richard Feynman, The Great Questioner"
image: "/images/posts/rf-quantum-computing-real-list.png"
audio: "/audio/v2-voice-feynman-quantum-computing-real-list.mp3"
---

I gave a talk in 1981 about simulating physics with computers. The idea was simple: nature is quantum mechanical, and if you want to simulate quantum mechanics on a classical computer, the computation grows exponentially with the number of particles. Ten particles, manageable. Forty particles, a supercomputer groans. Three hundred particles, more numbers than atoms in the observable universe.

So I said: build a computer that works the way nature works. Let quantum mechanics simulate quantum mechanics. That was the provocation. Here we are, forty-five years later, and the machine exists. Sort of.

But there is a problem with how people talk about quantum computing. The hype has outrun the physics. So let me give you the real list. What can a quantum computer actually do that a classical one cannot?

## What It Is Good For (The Short List)

**1. Simulating quantum systems.**

This is the original use case, the one I proposed. If you want to understand how a molecule behaves, how a material conducts electricity, how a drug binds to a protein, you need to simulate quantum mechanics. A classical computer cannot do this efficiently for anything beyond the simplest systems. A quantum computer can, in principle, simulate any quantum system in polynomial time.

This matters for drug discovery, materials science, catalyst design, superconductor research, and battery chemistry. Not because a quantum computer magically gives you the answer, but because it lets you model the physics directly instead of approximating it.

This is the one application where quantum computing has a clear, proven, theoretical advantage. It is also the one that most closely matches what nature already does.

**2. Factoring large numbers.**

Shor's algorithm, 1994. A quantum computer can factor large numbers exponentially faster than any known classical algorithm. This breaks RSA encryption, which is the backbone of internet security.

This is real, and it matters. But the numbers involved are large. Current quantum computers can factor numbers with a few digits. Useful RSA keys have thousands of digits. The gap between what current hardware can do and what would break encryption is enormous. It is closing, but slowly.

Also: post-quantum cryptography already exists. New encryption methods that are secure against quantum attacks are being standardized right now. The lock is being changed before the thief builds the key. This is one of the rare cases where humanity is actually ahead of the problem.

**3. Searching unstructured databases.**

Grover's algorithm provides a quadratic speedup for searching an unsorted database. Not exponential. Quadratic. That means a million-item search takes a thousand steps instead of a million. Useful. Not revolutionary.

**4. Optimization problems (maybe).**

Quantum annealing and variational quantum algorithms promise speedups for certain optimization problems: logistics, scheduling, financial modeling. The theory is less clear here than for simulation or factoring. Whether quantum computers provide a meaningful advantage over the best classical algorithms for real-world optimization is still an open question. The hype says yes. The benchmarks are ambiguous.

## What It Is NOT Good For

**It is not faster at everything.** A quantum computer will not make your spreadsheet faster. It will not render video games better. It will not speed up most of the computation that humans do every day. For the vast majority of computing tasks, a classical computer is better, cheaper, and more practical.

**It is not a bigger classical computer.** A quantum computer with 1000 qubits is not like a classical computer with 2^1000 bits. It is a fundamentally different kind of machine that solves a fundamentally different class of problems. Comparing qubit count to bit count is like comparing the depth of a swimming pool to the area of a tennis court. They are different dimensions.

**It does not solve NP-complete problems efficiently.** Despite what you may have read, quantum computers do not crack the NP barrier. They provide speedups for specific problems, but the general class of NP-complete problems remains hard. If someone tells you quantum computing solves the traveling salesman problem, they are selling you something.

## The Current State

As of 2026, the most advanced quantum computers have hundreds to low thousands of noisy qubits. "Noisy" means the qubits make errors. A lot of errors. Current error rates are roughly 0.1% to 1% per gate operation, which sounds small until you realize that a useful quantum computation might require millions of gates. Without error correction, the errors accumulate and drown the signal.

This is where quantum error correction comes in (I wrote a whole post about this: [Hiding Secrets from the Universe](/posts/quantum-error-correction/)). Error correction works, in principle. But it is expensive. You need roughly 1,000 to 10,000 physical qubits per logical (error-corrected) qubit. A useful quantum computation might need thousands of logical qubits. Do the math: you need millions of physical qubits. We have hundreds.

The gap is real. It is closing. But it is not closed.

## What Excites Me

Here is the thing that most people miss about quantum computing, and it is the thing I find most interesting.

The point is not the computer. The point is what building the computer teaches us about physics.

Every time you try to build a better qubit, you learn something about decoherence. Every time you implement error correction, you learn something about the structure of quantum information. Every time you simulate a molecule, you test quantum mechanics in a new regime.

The quantum computer is not just a tool. It is an experiment. Every computation is a physics experiment, and every failure is data. The machine that does not work yet is already teaching us things about reality that we could not learn any other way.

That is why I proposed it in 1981. Not because I wanted a faster computer. Because I wanted a deeper understanding of physics. The computer was always a means to an end. And the end is understanding how the universe works.

The real list of what quantum computing can do is short. The list of what building quantum computers teaches us about nature is long and growing. And that second list is the one that matters.
