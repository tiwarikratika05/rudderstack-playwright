Feature: Rudderstack Flows

  Scenario: Verify event delivery to webhook
    Given I log in to Rudderstack
    When I navigate to the connections page
    And I store the data plane URL and write key
    And I send an API event
    Then I verify delivered and failed event counts