'use strict';

const Controller = require('egg').Controller;
const path=require('path');
const baseDir = path.resolve('.');
class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, welcome use front-End proxy gateway';
  }
}

module.exports = HomeController;
