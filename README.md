# e-com-next

## About

This project is a fully functioning (except payment method) e-commerce site that uses next.js.

## Features

- User can sign in and sign up.
- Auth with NextAuth.
- Some api routes are protected via signed double submit cookie method.
- Products can be filtered.
- Products can be searched.
- Products can be added to market.
- Market can be seen.
- Ordered products can be seen.
- Profile can be edited.

## Page Routes

- [Home](https://e-com-next-lac.vercel.app/) - See 9 most popular products.
- [Products](https://e-com-next-lac.vercel.app/products) - See all products filter, search or add them to market.
- [Products/[id]](https://e-com-next-lac.vercel.app/products/1) - `TBA`.
- [Sign In](https://e-com-next-lac.vercel.app/signIn) - Sign in.
- [Sign Up](https://e-com-next-lac.vercel.app/signUp) - Sign up.
- [Edit Profile](https://e-com-next-lac.vercel.app/editProfile) - Edit profile.
- [Edit Password](https://e-com-next-lac.vercel.app/editPassword) - Edit password.
- [Checkout](https://e-com-next-lac.vercel.app/checkout) - Buy products that are in the market.
- [Orders](https://e-com-next-lac.vercel.app/orders) - See ordered products.

## Api Routes

- Auth/[...nextauth] - Nextauth route.
- Auth/editProfile - Edit profile.
- Auth/editPassword - Edit password.
- Auth/signUp - Sign up.
- buyMarket - Buy products in the market.
- getUserData - Get user data.
- getCsrf - Get custom csrf tokens.

## Live Demo

https://e-com-next-lac.vercel.app/

## Technologies

- Typescript
- React
- Next
- NextAuth
- ~~Supabase (only for database)~~
- Vercel Postgres
