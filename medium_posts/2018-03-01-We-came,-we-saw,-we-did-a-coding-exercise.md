---
title: We came, we saw, we did a coding exercise
author: Ezra Freedman
date: 2018-03-01T21:08:31.992Z
url: https://medium.com/random-string/we-came-we-saw-we-did-a-coding-exercise-f426cf634140
subtitle: How a seemingly simple coding exercise can reveal a lot about an engineering candidate
---

![](./medium_posts/images/We-came,-we-saw,-we-did-a-coding-exercise/1_8GcIbDk_nq2QzzjsvZn5Vg.jpg)

Over the years, we asked hundreds of software developer candidates to complete the following exercise:

> **Write code, in your choice of language, that takes as input a string and arbitrary shift and returns that string encoded using a basic**[**Caesar Cipher**](https://en.wikipedia.org/wiki/Caesar_cipher)**.**

The tradition began when we were advertising on job boards and needed to efficiently identify legitimate candidates before even doing a phone screen. Later, we used it after a phone screen but before bringing someone in for an interview. **Despite the simplicity of the problem, it provided great insight into the coding style and capability of the candidate.**

Some things we would look at:

  * Did the candidate accept the assignment with positivity? _(True story — we had one candidate who accused us of this assignment being a ploy to get him to do “free work” and refuse to do the assignment)_.
  * Did the candidate ask clarifying questions? How was the communication?
  * Did the candidate solve the problem correctly?
  * Does the solution handle edge cases? (A common missed edge case would be to handle the ‘z’ to ‘a’ shift, but larger shifts, such as 52, result in an error).
  * Are the methods and variables named clearly?
  * Did the candidate document any assumptions?
  * Did the candidate provide any tests? If so, were they well written and did they actually test something?

This submission is correct, handles many edge cases properly and makes use of a Ruby method String#tr <https://apidock.com/ruby/String/tr> which is well suited to the task.

## **“Code smells”**

From Martin Fowler’s blog, “a [**code smell**](https://martinfowler.com/bliki/CodeSmell.html) is a surface indication that usually corresponds to a deeper problem in the system”.

In evaluating submissions we would look for certain problems that could be considered code smells.

One construct we’d see often is a manual enumeration of the alphabet, for example (from a real submission):  
`alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'`

Not only is this very tedious to write, it would be very easy to skip a letter, reverse a letter, and difficult to properly test. Rather than manual enumeration, we’d much rather the candidate leverage built-in features of the programming language they select. In ruby, this could be: `('a'..'z').to_a + ('A'..'Z').to_a`. In python, `list(string.ascii_lowercase + string.ascii_uppercase)`

Another common construct was the use of magic numbers. The following is from a real submission in Ruby:

This submission shows copious use of magic numbers

If I want to validate this code, I need to pull up the ASCII table to remind myself what 64, 91, 65, 96, 97 and 123 correspond to. **I would much prefer to see ‘A’.ord over 95.** _(Astute readers will note that this example also fails to handle large shifts properly, and could benefit from use of the modulo operator)._

## **“Bonus Points”**

On the other side of the spectrum, there are also some things we’d see that I’d put in the bonus category — not needed, but appreciated. Some examples:

  * Did the candidate realize that decrypt is just “negative encrypt” and add a decrypt method that leverages this fact?
  * Did the candidate make reasonable assumptions as to which characters to support, how to handle numbers, etc.?
  * Did the candidate choose a good delivery mechanism for the code? _(Believe it or not we’d occasionally get submissions in Word, smart quotes and all)._

## **Code Walkthrough**

If we decided to continue to an in-person interview, we would print out the candidate’s solution and review it with them live. **Code walkthrough was often very helpful in learning more about the candidate.** We could evaluate things like:

  * How clearly do they explain their work?
  * How responsive are they to constructive criticism?
  * If we explain an alternate solution, how well do they follow along?
  * Are we confident that they indeed came up with this solution (as opposed to just copying something they found online and perhaps don’t fully understand)?

## Sending Feedback

On the other hand, if we ruled out the candidate based on the solution (but still felt they made reasonable effort), we would do our best to send constructive feedback on the code sample, even if it was not explicitly requested. While this follow-up would occasionally be returned with silence, it was not uncommon to receive replies with thanks, and we felt it to be part of doing the right thing.

On this note, this is my first post on this blog, your feedback is appreciated!