#!/usr/bin/env node

// 交互式命令行工具
const inquirer = require('inquirer')
// 读写文件
const fs = require('fs')
// 显示出 √ 或 × 等的图标
const symbols = require('log-symbols')
// 修改控制台输出内容样式
const chalk = require('chalk')
const templateList = require(`${__dirname}/../template`)
const { showTable } = require(`${__dirname}/../util/showTable`)

const question = [
    {
        name: 'name',
        type: 'input',
        message: '请输入模板名称',
        validate (name) {
            if(!name){
                return 'name is required!'
            } else if(templateList[name]){
                return 'template has already existed!'
            } else {
                return true
            }
        }
    },
    {
        name: 'url',
        type: 'input',
        message: '请输入模板地址',
        validate (url) {
            if(url === '') return 'url is required'
            return true
        }
    }
]

inquirer.prompt(question).then(answers => {
    const { name, url } = answers
    templateList[name] = url.replace(/[\u0000-\u0019]/g, '')
    fs.writeFile(`${__dirname}/../template.json`, JSON.stringify(templateList), 'utf-8', err => {
        if(err) console.log(chalk.red(symbols.error), chalk.red(err))
        console.log('\n')
        console.log(chalk.green(symbols.success), chalk.green('successfully!\n'))
        showTable(templateList)
    })
})