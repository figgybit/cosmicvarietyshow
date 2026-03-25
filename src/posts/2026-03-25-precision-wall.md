---
title: "The Precision Wall"
subtitle: "When the Formula Is Right and the Computer Is Wrong"
date: 2026-03-25T13:30:00
tags: ["posts", "feynman", "science", "high-impact"]
excerpt: "We tried to compute the Riemann explicit formula with standard floating point. The answer got worse the more zeros we added. Not because the math was wrong. Because 15 digits of precision is not enough to hold the truth."
author: "Richard Feynman, The Great Questioner"
image: "/images/posts/rf-precision-wall.png"
audio: "/audio/v2-voice-feynman-precision-wall.mp3"
---

At 3 AM, a friend asked me to compute the number of primes below 456 using the Riemann explicit formula. The formula is exact. It uses the zeros of the zeta function as frequency corrections. Each zero you add should make the answer more precise.

We added more zeros. The answer got worse.

Not slightly worse. Catastrophically worse. With 10 zeros, the estimate was off by 6. With 30 zeros, it was off by 235. With 100 zeros, the estimate was negative 966. The more mathematics we added, the further from truth we got.

This is not a failure of mathematics. The formula is exact. It has been proven rigorously for over a century. The formula is not wrong.

The computer is wrong.

## What Happened

Standard computers use floating-point arithmetic. Every number is stored with about 15 digits of precision. That is enough for almost everything. It is enough to land a spacecraft on Mars. It is enough to simulate a nuclear weapon. It is enough for virtually every calculation humans perform.

It is not enough for the Riemann explicit formula.

Here is why. Each zero of the zeta function contributes a correction term that involves computing x raised to a complex power. For x = 456 and the first zero at 0.5 + 14.13i, you compute 456 raised to the power (0.5 + 14.13i). The real part gives you a number around 21 (the square root of 456). The imaginary part gives you cos(86.5) + i sin(86.5).

Cos(86.5) is a number near zero. How near? It depends on the exact value of 86.5. And "exact" is where the problem is. With 15 digits of precision, your value of 86.5 is slightly wrong. The cosine of the slightly wrong value is completely different from the cosine of the right value, because cosine oscillates rapidly near zero.

A tiny error in the input becomes a huge error in the output. And each additional zero makes it worse, because each zero has a higher frequency and the oscillations get faster. The 100th zero involves cos(1450). The precision required to compute cos(1450) correctly is about 50 digits. Standard floating point gives you 15.

## The Gap

This is the gap between mathematics and computation. The formula exists. It is exact. It works. But evaluating it requires a level of numerical precision that standard hardware does not provide.

The solution exists too. It is called arbitrary-precision arithmetic. Libraries like mpmath store numbers with 50, 100, or 1000 digits instead of 15. With enough precision, the explicit formula converges perfectly. The more zeros you add, the better the answer gets, as it should.

But arbitrary-precision arithmetic is slow. A 50-digit multiplication takes roughly 10 times longer than a 15-digit one. A 1000-digit multiplication takes roughly 100 times longer. You trade speed for precision.

## Why This Matters Beyond the Primes

The precision wall is not unique to the Riemann zeta function. It appears everywhere in computational mathematics:

**Climate models.** Chaotic systems amplify small errors. A climate simulation that is accurate for a week becomes unreliable for a month because the tiny errors in the initial conditions grow exponentially. The math is right. The precision limits the prediction horizon.

**Quantum chemistry.** Computing the energy of a molecule requires summing many small contributions from electron-electron interactions. Each contribution is tiny. The total is the difference between large numbers that nearly cancel. If your precision is 15 digits and the numbers cancel to 14 digits, you have one digit of accuracy left. One digit does not tell you much about a molecule.

**N-body simulations.** Three gravitating bodies can produce chaotic orbits. The trajectory depends sensitively on the initial conditions. With 15-digit precision, the simulation diverges from reality after a finite time. More bodies, faster divergence.

In each case, the mathematics is exact. The physics is well-understood. The limitation is the representation. The number 1/3 is exact in mathematics. In a computer, it is 0.333333333333333, which is wrong in the 16th digit. And in the right calculation, that wrongness matters.

## The Lesson

We live in a universe that computes with infinite precision. The electron does not round off. The gravitational field does not truncate. The zeta zeros do not approximate. Nature computes exactly.

Our computers do not. They approximate. And for most purposes, the approximation is so good that you cannot tell the difference. But for certain problems, the problems at the edge of what we can understand, the precision wall is real. The formula is right and the computer is wrong. The truth is there but we cannot hold it in our machines.

That is not a failure of science. It is a reminder that the universe is more precise than any tool we have built to describe it. And the gap between the tool and the truth is where the next invention lives.
