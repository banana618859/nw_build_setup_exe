/*
 * @Descripttion: unTitle
 * @Author: yizheng.yuan
 * @Date: 2021-10-14 10:37:36
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2021-10-14 11:20:26
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
