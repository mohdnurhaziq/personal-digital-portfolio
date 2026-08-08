<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin account
    |--------------------------------------------------------------------------
    |
    | The site is single-owner: one account, seeded from the environment, used
    | to sign in to /admin. There is no public registration. The password has
    | no default on purpose — the seeder skips creating the user when it is
    | unset, so a deploy can never fall back to a guessable credential.
    |
    */

    'admin' => [
        'name' => env('ADMIN_NAME', 'Mohd. Nur Haziq Irsyamuddin'),
        'email' => env('ADMIN_EMAIL', 'hello@ziq.dev'),
        'password' => env('ADMIN_PASSWORD'),
    ],

];
