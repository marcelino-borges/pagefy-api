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

### [1.10.0] - 2022-10-27

-Feature: Added new button type: TextOverImage

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
