<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- No <title> here on purpose. Every page sets its own through Inertia's
             <Head>, and SSR injects it via @inertiaHead. A title in this template
             would come first in document order and win over the real one. --}}

        {{-- Fonts are self-hosted through fontsource in resources/css/app.css,
             so there is deliberately no font CDN link here. --}}

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
