# L3 - Senior Software Engineer Take-Home Exercise

**PURE Home River**\
**Full Stack Engineer - Take-Home Exercise**

------------------------------------------------------------------------

## Overview

Thank you for your interest in the Senior Full Stack Engineer role at
PURE Home River!

This exercise is designed to give us a sense of how you approach
building a full stack application from scratch. It should take no more
than 6 hours to complete.

We want to see how you think about data modeling, API design, and
frontend development.

There are no trick questions here, and we genuinely want you to enjoy
the process.

AI tools are encouraged! At PURE Home River, AI-driven tools are an
important part of our engineering workflow. Feel free to use any AI
assistants, code generation tools, or other resources you find helpful.
We'd love to hear about how you used them during the interview.

------------------------------------------------------------------------

## The Scenario

Consider a simple application with one entity named **Property Agent**
who handles multiple rental properties.

Each property has one or more tenants belonging to a single family.

An agent also creates notes and reminders for themselves to help perform
certain actions on the property such as maintenance, pest control, etc.

------------------------------------------------------------------------

## Part 1: Data Model

Present a relational data model of the application, identifying:

-   All tables\
-   Constraints\
-   Relationships

This can be a handwritten document you scan or you can use an ER
diagramming tool --- whatever you prefer.

------------------------------------------------------------------------

## Part 2: REST API

Build a REST API in **TypeScript** that allows CRUD operations on the
**Property Agent** entity.

-   Store all data in memory (no database required)

### Property Agent attributes:

-   `id`
-   `firstName`
-   `lastName`
-   `email`
-   `mobileNumber`

Include two additional attributes to capture:

-   Creation timestamp
-   Update timestamp

### Stretch Goal

Identify one improvement we have not explicitly listed in these
requirements but you think is important to include. We will discuss it
during the interview.

------------------------------------------------------------------------

## Part 3: Vue Web Client

Build a Vue-based web client that supports:

### Create / Update

-   Provide a form for inputting values
-   Send an HTTP request to the backend

### List / View (all or single)

-   Show the HTTP request using a tool such as Postman or curl

### Delete (single agent)

-   Show the HTTP request using a tool such as Postman or curl

During the interview, we will discuss what type of error handling is
required and where it should happen (frontend vs. backend).

------------------------------------------------------------------------

## Submission

-   Create a repository on GitHub or GitLab and share it with your
    recruiting contact
-   Use your commit history to help us understand how you built the
    application in smaller, meaningful increments
-   Please submit at least 24 hours before your scheduled interview

------------------------------------------------------------------------

## What to Bring to the Interview

-   Your completed repository with:
    -   Data model
    -   API
    -   Vue client
-   Be prepared to walk us through your code and explain your design
    decisions
-   Be ready to discuss your stretch goal improvement and error handling
    approaches
-   If you used AI tools during the exercise, we would love to hear
    about your experience:
    -   What worked well
    -   What you adjusted
    -   How AI fits into your workflow

------------------------------------------------------------------------

Good luck, and we look forward to seeing your work!
