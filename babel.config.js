module.exports = {
    presets:[
        "@babel/preset-env",
        "@babel/preset-react"
    ]
}








// initially tried making a babel.rc file, per some articles and video online. this file works ...

// contents of babel.rc file:
// {
//     "presets": [
//         "@babel/preset-env",
//         "@babel/preset-react"
//     ],
//     "plugins": [
//         "@babel/plugin-transform-runtime",
//         "@babel/plugin-plugin-syntax-jsx"
//     ]
// }