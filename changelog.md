# Changelog

---

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html):

- Given a version number MAJOR.MINOR.PATCH, increment the:
  1. MAJOR version when you make incompatible API changes
  2. MINOR version when you add functionality in a backwards compatible manner
  3. PATCH version when you make backwards compatible bug fixes
  4. Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

---

## Versions

### [1.22.0] - 2025-03-16

- Feat: onboardings with specific endpoints

### [1.21.1] - 2025-03-16

- Feat: user model with onboardings flags

### [1.21.1] - 2025-03-15

- Fix: various fixes

### [1.21.0] - 2025-03-11

- Feature: endpoint to get whether the user can create a page

### [1.20.0] - 2025-03-11

- Feature: added validations for user's plan:
  - Utils for plan validations
  - Analytics events for click and view;
  - Removal of custom js on create page if user doesn't have this feature in the plan
  - Removal of components launch date on create and update page if user doesn't have this feature in the plan
  - Removal of animations on create and update page if user doesn't have this feature in the plan
  - Validating if user has already created the max number of pages allowed by his plan
- Feature: preparation to receive "lang" in headers to decide which will be the language of the message returned by the API
- Refactor: imports using path aliases
- Refactor: module augmentation for Express Request

### [1.19.0] - 2025-03-01

- Refactor: changing name from socialbio to pagefy

### [1.18.0] - 2022-11-18

- Fix: Changed prop from `userId` to `user` in testimonials controller
- Feature: Implemented Faq CRUD
- Fix: changed `locale` to `language` in ITestimonial

### [1.17.1] - 2022-11-13

- Refactor: changed field `userId` to `user` in Testimonial collection/model

### [1.17.0] - 2022-11-13

- Feature: Implemented GET testimonials (optional `count` in query)

### [1.16.0] - 2022-11-02

- Feature: Update and delete testimonial

### [1.15.1] - 2022-11-02

- Fix: Get all user testimonials sorting invert

### [1.15.0] - 2022-11-01

- Feature: Implemented testimonials get and create
- Feature: Bearer authorization in Swagger

### [1.14.0] - 2022-11-01

- Feature: default type of plan for a new user now comes from an ENV var (default set to 2 - Platinum)

### [1.13.0] - 2022-10-29

- Feature: Added counters for the user page

### [1.12.0] - 2022-10-28

- Feature: Added CurrentPercentage to the component's interface and Mongo model
- Feature: Added ProgressBar to the ComponentType enum

### [1.11.0] - 2022-10-28

- Feature: Added Map component to enum

### [1.10.0] - 2022-10-27

- Feature: Added new button type: TextOverImage

### [1.9.3] - 2022-10-27

- Fix: check on userId with inverted logic for the delete image service

### [1.9.2] - 2022-10-26

- Fix: Verifying url and userId on delete file endpoint

### [1.9.1] - 2022-10-10

- Fix: Verifying url and userId on delete file endpoint

### [1.9.0] - 2022-10-10

- Feature: Public endpoint to return user's plan

### [1.8.0] - 2022-10-10

- Feature: Added custom scripts to page models

### [1.7.0] - 2022-10-10

- Feature: Image details now has a flag for system owned images

### [1.6.0] - 2022-10-09

- Feature: Implemented endpoints to get:
  - All user images
  - All buttons templates
  - All backgrounds templates
  - All pages images templates

### [1.5.1] - 2022-10-03

- Fix: Deleteing files when user deletes the account

### [1.5.0] - 2022-10-03

- Feature: Implemented endpoint to delete an user

### [1.4.1] - 2022-10-02

- Fix: recaptcha token verification

### [1.4.0] - 2022-10-02

- Feature: Implemented recaptcha endpoint and middleware validation

### [1.3.0] - 2022-10-01

- Feature: Implemented email contact to serve support page

### [1.2.0] - 2022-09-29

- Fix: added preflight free cors
- Refactoring: simplified upload file path

### [1.1.0] - 2022-09-18

- Implemented new logging system using emojis different log functions for info, error, warning and success.

### [1.0.0] - 2022-09-18

- First release of the API on [RENDER](https://www.render.com)
