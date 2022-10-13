
Суть приложения: Игра в шахматы с компьютером.

Использовано: 
HTML
CSS
JavaScript
React
Next.js
Redux + Redux Toolkit
Lichess API

Реализованные основные особенности:
1) Полностью реализована логика игра в шахматы, включая такие специфические ходы, как рокировка, взятие на проходе, превращение пешки в другую фигуру, пат.

2) Использовано ООП. Доска и фигуры - это отдельные классы. Каждая фигура наследует методы и свойства от общего родительского класса Figure, при этом перезаписывая их при необходимости. 

3) Внешний вид доски, клеток и фигур сделан по образцу популярного сайта для игры в шахматы lichess.org.
 Реализована динамическая подсветка: a) клеток, куда может походить текущая фигура. b) клеток при возможности взятия фигуры. c) клеток последнего хода. 
Пользователь может сделать ход как перетащив фигуру с одной клетки на другую, так и кликнув сначала на фигуру, а потом на конечную клетку. После начала игры, в конце хода и при окончании игры проигрываются аудиофайлы.

4) Слева на панели можно выбрать сторону, сложность соперника и контроль времени.

5) Возможность игры с компьютером реализована с помощью Lichess API (https://lichess.org/api).

6) Реализован таймер. Из-за особенной Lichess API и задержки во времени при отправке необходимых HTTP запросов время таймера в приложении может отличаться на 1-3 секунды от соответствующего на серверах lichess. 
В начале каждого хода время синхронизируется заново.

7) Используются куки-файлы при помощи пакета 'react-cookie'. В них хранятся ID и история ходов текущей игры, поэтому пользователь может продолжить игру даже после обновления страницы, приложение восстановит состояние доски по её истории.




This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
