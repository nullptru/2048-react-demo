/**
 * Created by Burgess on 2017/7/14.
 */

import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

module.exports = {
    entry: path.resolve(__dirname, './src/components/board/Board.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name][hash:8].js',
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: 'babel-loader'
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({ //生产环境抽离css
                fallback: 'style-loader',
                use: [
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: "less-loader", // compiles Less to CSS

                    }
                ]
            })
        },{
            test: /\.html$/,
            use: 'html-loader'
        }]
    },
    plugins:[
        new CleanWebpackPlugin(['dist']),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin("./css/[name][hash:8].css"),
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
    devServer:{
        historyApiFallback: true,
        hot: true,
        inline: true
    }
};