# Budget App with Node

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the console mode

It will ask a question `What's the file path?`

Then type ### `input.json`

Hit enter

## Short Description

1. For Cash In Commission fee - 0.03% from total amount, but no more than 5.00 EUR.
2. For Cash Out There are different commission fees for cash out for natural and legal persons.

### Natural Persons

Default commission fee - 0.3% from cash out amount.

1000.00 EUR per week (from monday to sunday) is free of charge.

If total cash out amount is exceeded - commission is calculated only from exceeded amount (that is, for 1000.00 EUR there is still no commission fee).

You can get configuration from API

### Legal persons

Commission fee - 0.3% from amount, but not less than 0.50 EUR for operation.

3. `Result` - calculated commission fees for each operation. In each line only final calculated commission fee must be provided without currency.
