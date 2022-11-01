# Sky Bet Code Review Tech Test

​Welcome to the Sky Bet code review tech test! We would like you to review this application for us and let us know what you think.
​
## Why does this test exist?
​
### Code review is an important part of our ways of working, and something you will do daily if you decide to join us
Peer reviewing code is a big part of our ways of working at Sky Bet. All changes to our codebase are reviewed by engineers before being merged into main and released to our customers. This is a practice that engineers at all levels take part in, from junior, to mid-level, senior and principal/lead engineers.
There are a few reasons for this, such as maintaining a high standard of code quality, but one of the most important is for learning. One of our company values is 'Know it, Share it' and one of the best ways to learn is by reviewing other peoples' work to provide them with both supportive and healthy critical feedback.
​
### We want this to help us to guage your level of technical ability
This is hopefully fairly self explanatory. We would like you to use your knowledge and experience in software engineering to tell us what you think is good, and bad, about the code in this repository, providing some suggestions for improvement. If you progress to an interview stage then we may use some of your feedback as talking points in the interview to explore your thinking further.
​
### Our hope is for this test to be inclusive, enjoyable, and relatively stress free
Another of our company values is 'Free To Be Me' and we are committed to improving our inclusive hiring practices.

​
[Studies have shown that traditional technical interviews](https://news.ncsu.edu/2020/07/tech-job-interviews-anxiety/), where you are expected to work through coding problems in person are not inclusive, and are more likely to test whether a candidate suffers from performance anxiety than their technical abilities. For this reason, we moved a few years ago to 'take home' tech tests, where candidates submit an application for us to review.

​
However, feedback from many candidates has been that take-home tech tests can be tedious and time consuming. Whilst we don't put a deadline on submissions, candidates are required to spend a significant amount of time on these tests. Some candidates, such as parents with young families, may not have this time to spare. Work-life balance is important to us at Sky Betting and Gaming.
​

Our aim is for this test to be a better alternative! 
​
 - You will still be able to complete the test in your own time and space rather than in a pressurised environment
 - We've written the application for you, rather than the other way around! Reviewing code is generally less time consuming than writing code so our hope is that this is a less onerous task. Please do not spend more than 2 hours of your time on this task
​

Please do provide feedback to our recruitment team or hiring managers on how you found the test, and we will take this onboard as we look to continue improving our hiring processes.

​
## Ok, you probably want to know what the test is now! Here's what we want you to do...
​
Please review this code repository for us, in the same way that you would if you were given a pull request as an engineer at work. Amongst other things you may want to consider:
* What could be improved?
* Would you be happy with this code being shipped to production? 
* If not then what tasks need to be taken for it to get your signoff?

​
There is not a deadline for this task, but we would ask you please to spend no more than 2 hours on it. Try to book out some of your time to review it, and then send it back to our recruitment team.

### What if I don't understand some of the technologies used in this tech test?
This is fine. Hopefully you should be able to understand enough of what's going on to provide some feedback without knowing specific details of all the technologies used. If you really struggle with this then please let our recruitment team know and we will discuss options for an alternative tech test
​
### How to submit your review
At work, code reviews are usually done through tools like github or bitbucket but for simplicity for this test, please add your suggestions as code comments throughout the app, and add a markdown file with general comments before zipping / bundling the repo up and returning it to us.
​
## About this app
This app is a web crawler written in Node.js with React UI (and Next.js) to display the results. The results are sent to the UI via a websocket connection (using socket.io). The UI supplies the server three parameters - the URL to start with, a regular expression specifying which URLs it should follow, and the maximum number of HTTP requests that should be performed concurrently.
​
## Acceptance criteria for this app

* It will start crawling from a given target URL
* It will report any links it finds to a UI in real time
* It will only list Web links (http / https)
* It will follow any urls which match a given regular expression
* It will be scalable
* It will support rate limiting

## How to run the app

* You'll need to install Node `18.0.0` or higher. You can grab it from [here](https://nodejs.org/en/download/) or install it using [asdf](https://github.com/asdf-vm/asdf).
* Once you have node installed, run `yarn install` from the root directory to install the module dependancies.
* Finally, run `yarn dev` to run the project in development mode.
