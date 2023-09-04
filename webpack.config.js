const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/script.ts',
    output: {
        filename: 'bundle.js', // Назва вихідного JavaScript файлу
        path: path.resolve(__dirname, 'dist'), // Шлях до папки dist
    },
    resolve: {
        extensions: ['.ts', '.js'], // Дозволяє Webpack розпізнавати файли з розширенням .ts та .js
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Всі файли з розширенням .ts
                use: 'ts-loader', // Використовувати ts-loader для компіляції TypeScript
                exclude: /node_modules/, // Виключити папку node_modules
            },
            {
                test: /\.css$/, // Всі файли з розширенням .css
                use: ['style-loader', 'css-loader'], // Використовувати style-loader та css-loader для обробки стилів
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Ваш файл HTML
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 3000, // Ви можете змінити порт на ваш вибір
    },
};
