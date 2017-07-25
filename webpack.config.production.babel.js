/**
 * Created by Burgess on 2017/7/24.
 */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import pkg from './package.json'

module.exports = {
    entry: {
        app: path.resolve(__dirname, './src/components/board/Board.js'),
        vendor: Object.keys(pkg.dependencies) //生产环境三方库单独打包
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: './js/[name][hash:8].js',
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: 'babel-loader'
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ //生产环境抽离css
                fallback: 'style-loader',
                use: [
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            importLoaders: 1,
                            minimize: true
                        }
                    },
                    {
                        loader: "postcss-loader", // compiles Less to CSS
                        options: {
                            config: {
                                path: path.resolve(__dirname)
                            }
                        }
                    },
                    'less-loader'
                ]
            })
        }, {
            test: /\.html$/,
            use: 'html-loader'
        }]
    },
    plugins: [
        // webpack 内置的 banner-plugin，生产环境Copyright
        new webpack.BannerPlugin("Copyright by Burgess"),

        // 定义为生产环境，编译 React 时压缩到最小
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new ExtractTextPlugin("./css/[name][hash:8].css"),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        }),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV === 'dev') || 'false'))
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true
    }
};