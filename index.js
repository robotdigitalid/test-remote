const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

class SiteCreator {
  constructor(content, profile = 'Default'){
    this.content = content;
    this.executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    this.userDataDir = 'C:/Users/hakir/AppData/Local/Google/Chrome/User Data';
    this.args = ['--user-data-dir'];
    this.setProfile(profile);
  }

  setProfile(profile){
    if (!profile || !fs.existsSync(path.join(this.userDataDir, profile, 'Google Profile.ico')))
      throw new Error(`Profile is invalid, for available chrome profile!`);
    this.profile = profile;
  }

  getChromeProfiles(){
    const profileDirs = fs.readdirSync(this.userDataDir);
    const profiles = profileDirs.filter(dir => fs.existsSync(path.join(this.userDataDir, dir, 'Google Profile.ico')));
    return profiles;
  }

  async boldFont(){
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('B');
    await this.page.keyboard.up('Control');
  }

  async underlineFont(){
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('U');
    await this.page.keyboard.up('Control');
  }

  async italicFont() {
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('I');
    await this.page.keyboard.up('Control');
  }

  async alignCenter() {
    await this.page.keyboard.down('Control');
    await this.page.keyboard.down('Shift');
    await this.page.keyboard.press('E');
    await this.page.keyboard.up('Shift');
    await this.page.keyboard.up('Control');
  }

  async header(text) {
    //membuat judul
    console.log('Creating title ..');
    await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.gk8rDe > div.zXDYWd.guoAab.mYVXT > group > div.JNdkSc-SmKAyb > div > row > div > div.oKdM2c.guoAab.row_Default > tile > div.jXK9ad-SmKAyb.v7v1sb > div > div.BdNftd', { visible: true });//ini
    await this.page.click('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.gk8rDe > div.zXDYWd.guoAab.mYVXT > group > div.JNdkSc-SmKAyb > div > row > div > div.oKdM2c.guoAab.row_Default > tile > div.jXK9ad-SmKAyb.v7v1sb > div > div.BdNftd');
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    await this.page.keyboard.press('Backspace');
    await this.page.type('div.BdNftd', text )
  }

  async inputSection2(title, author){
    console.log('Input section 2 ..');
    await this.page.click('#wWGgfe > div > div.GxjTuf > div:nth-child(1) > div > span > span > span')
    await this.page.waitForTimeout(500)
    await this.boldFont()
    await this.page.keyboard.type('Read ')
    await this.boldFont()
    await this.page.keyboard.type('and ')
    await this.italicFont()
    await this.page.keyboard.type('download ')
    await this.italicFont()
    await this.boldFont()
    await this.page.keyboard.type(title) 
    await this.boldFont()
    await this.page.keyboard.type(' in PDF, EPub, Mobi, Kindle online. Free book ')
    await this.italicFont()
    await this.page.keyboard.type('Behind Your Smiles: Eternity Publishing by '+ author)
    await this.italicFont()
    await this.alignCenter()
    await this.page.keyboard.press('Enter')
    await this.boldFont()
    await this.page.keyboard.type(title +' PDF')
    await this.boldFont()
    await this.page.keyboard.press('Enter')
    await this.page.keyboard.type('By - '+ author)
  }

  async insertImg(link){
    // image
    console.log('Inserting image ..');
    await this.page.waitForSelector('.d6wWde', {visible: true})
    await this.page.waitForTimeout(500)
    await this.page.click('.d6wWde')
    await this.page.waitForTimeout(500)
    await this.page.waitForSelector('span.Ix4kpb:nth-child(2) > div:nth-child(2) > div:nth-child(1)', {visible: true})
    await this.page.click('span.Ix4kpb:nth-child(2) > div:nth-child(2) > div:nth-child(1)')

    await this.page.waitForSelector('.OGNeob > iframe', {visible: true})
    const elementHandle = await this.page.$('.OGNeob > iframe');
    const frame = await elementHandle.contentFrame()
    await frame.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2)', {visible: true})
    await frame.click('div.ThdJC:nth-child(2) > span:nth-child(2)')
    await frame.waitForSelector('.whsOnd', {visible: true})
    await frame.evaluate((val) => {
      document.querySelector("input[type='text']").value = val
    }, link);
    await frame.type('.whsOnd',String.fromCharCode(13));
    await frame.waitFor(2500);

    await frame.waitForSelector('#yDmH0d > div.Q6HCU.IzuY1c.tJJJGe > div.H0U9m > div.WY4Fyb > div > div > div > div > div.hSF15e > div:nth-child(2)', {visible: true})
    await frame.click('div.U26fgb:nth-child(2) > span:nth-child(3) > span:nth-child(1)')
    await this.page.waitForTimeout(1000)

    for (let j = 0; j<4; j++ ){
      await this.page.waitForTimeout(100)
      await this.page.keyboard.press("ArrowRight")
    }
    await this.page.waitForTimeout(500)
  }

  async clickButtonWhenEnabled(selector){
    await this.page.evaluate((sel)=>{
      return new Promise((resolve,reject)=>{
        let retry = 8;
        let id = setInterval(()=>{
          let el = document.querySelector(sel);
          if(el != null && el.ariaDisabled == null){
            el.click();
            clearInterval(id);
            return resolve(true);
          } else {
            retry--;
          }
  
          if(retry <= 0){
            clearInterval(id);
            return reject('Gagal klik tombol');
          }
        },2500);
      });
    }, selector);
  
    await this.page.waitFor(2500);
  }

  async headingLink(text) {
    await this.page.waitForTimeout(500)
    await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', {visible: true})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(500);
    await this.page.keyboard.type(text)
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    await this.page.waitForTimeout(300);
    await this.page.waitForSelector('.vuEmub', {visible: true})
    await this.page.click('.vuEmub')
    await this.page.waitForTimeout(500);
    await this.page.waitForSelector('.nK92pf > div:nth-child(2) > div:nth-child(3)', {visible: true})
    await this.page.click('.nK92pf > div:nth-child(2) > div:nth-child(3)')
    await this.page.waitForSelector('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
    await this.page.click('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
    await this.page.waitForTimeout(500)
    await this.page.type('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)','18', { delay: 10})
    await this.page.waitForTimeout(500)
  }

  async downloadButton(text, link) {
    await this.page.waitForTimeout(500)
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(500)
    await underlineFont()
    await this.page.waitForTimeout(200)
    await boldFont()
    await this.page.waitForTimeout(200)
    await this.page.keyboard.sendCharacter('⇒')
    await this.page.waitForTimeout(200) 
    await this.page.keyboard.type(' '+text+' ')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.sendCharacter('⇐')
    await this.page.waitForTimeout(200) 
    await underlineFont()
    await this.page.waitForTimeout(200) 
    await boldFont()
    await this.page.waitForTimeout(200)
    await alignCenter()
    await this.page.waitForTimeout(200) 
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    await this.page.waitForTimeout(300);
    await this.page.waitForSelector('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
    await this.page.click('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
    await this.page.waitForTimeout(500)
    await this.page.type('div.W9wDc:nth-child(2) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', '18', { delay: 200})
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.bFhy9b > div:nth-child(12) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > span:nth-child(1)', { visible:true })
    await this.page.click('.bFhy9b > div:nth-child(12) > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > span:nth-child(1)')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.type(link)
    await this.page.waitForTimeout(200)
    await this.page.click('.Sd2wDb > div:nth-child(1) > span:nth-child(3)')
    await this.page.waitForTimeout(200)
  }

  async initBrowser(){
    console.log(`Open browser with '${this.profile}' profile..`);
    const args = [...this.args, `--profile-directory=${this.profile}`];
    this.browser = await puppeteer.launch({
      executablePath: this.executablePath,
      headless: false,
      defaultViewport: null,
      args,
    });
    return browser;
  }

  async initPage(){
    if (this.page) {
      try {
        await this.page.close();
      } catch (error) {
        console.log('Page is not initiated ..');
      }
    }
    this.page = await this.browser.newPage();
    await this.page.goto('https://sites.google.com');

    // Open new Site
    await this.page.waitForSelector('div.docs-homescreen-templates-templateview-preview.docs-homescreen-templates-templateview-preview-showcase > img');
    await this.page.click('div.docs-homescreen-templates-templateview-preview.docs-homescreen-templates-templateview-preview-showcase > img');  
    
    await this.page.waitForTimeout(500)  // tunggu 15 detik, gak diklik anggap error tanpa retry
    await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section', {visible: true})
    await this.page.waitForSelector('.Av8pHf');
    const test = await this.page.$eval('.Av8pHf', el=>{
      el.setAttribute('class', 'Av8pHf siiXfe LeqrYe')
      el.setAttribute('aria-hidden', 'false')
    });

    await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div.Av8pHf.siiXfe > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.YYHIke.i65P1d.Keh7oc.null.M9Bg4d');
    await this.page.evaluate(()=>{
      let el = document.querySelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div.Av8pHf.siiXfe > div.U26fgb.O0WRkf.oG5Srb.C0oVfc.YYHIke.i65P1d.Keh7oc.null.M9Bg4d');
      el.click();
    });
    await this.page.waitFor(1000);

    await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div:nth-child(3) > div:nth-child(5) > span > span > span.DPvwYc.rvGaTc', { visible: true });
    await this.page.evaluate(()=>{
      document.querySelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.y3IDJd.CatYBe.Fx3kmc.fmzcZd > span > div > div > div.bWTzgc > div > div > span > div > div.rZHESd > div > div > article > section > div.LS81yb.TZTnI.IKVHqc.aVXSwc.yaqOZd.LB7kq.O13XJf.nyKByd > div:nth-child(3) > div:nth-child(3) > div:nth-child(5) > span > span > span.DPvwYc.rvGaTc').click();
    });

    //atur format
    await this.page.waitForTimeout(500);
    await this.page.waitForSelector('div.ThdJC:nth-child(3)', {visible: true})
    await this.page.click('div.ThdJC:nth-child(3)') 
    await this.page.waitForTimeout(500);
    await this.page.mouse.wheel({deltaY: 1000})
    await this.page.waitForSelector('div.m6xOQ:nth-child(6)', {visible: true})
    await this.page.click('div.m6xOQ:nth-child(6)')
  
    await clickButtonWhenEnabled("div[guidedhelpid='at-appbar-publish']");
  
    const weblink = `${nanoid(16)}`.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase()
    
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.rXTzdc > div:nth-child(1) > input:nth-child(1)', {visible: true})
    await this.page.click('.rXTzdc > div:nth-child(1) > input:nth-child(1)')
    await this.page.type('.rXTzdc > div:nth-child(1) > input:nth-child(1)', weblink)
    await this.page.waitForSelector('.yfzDSb > svg:nth-child(1)', {visible: true})
    await this.page.waitForSelector('.OE6hId > div:nth-child(2)', {visible: true})
    await this.page.click('.OE6hId > div:nth-child(2)') 
      
    await this.page.waitForTimeout(2000)
    await this.page.waitForSelector('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)', {visible: true})
    await this.page.click('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)')
    await this.page.waitForTimeout(200)
    return true;
  }

  async createNewSite(item, isNewPage){
    let {
      header: header1,
      title,
      author,
      pages,
      publisher,
      language,
      description,
      tags,
      'ISBN-10': isbn_10,
      'ISBN-13': isbn_13,
      'Front Cover': linkimg,
      'read online link': linkDownBt,
      'read online text': textDownBt,
      'read online img': imgDownBt,
    } = item;
    let header2 = header1.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s\s+/g, ' ');
    isbn_13 = isbn_13.replace(/[^a-zA-Z0-9 ]/g, "");
    if (isNewPage) {
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', {visible: true})
      await this.page.click('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('.xmAgjb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
      await this.page.hover('.xmAgjb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.JRtysb:nth-child(3) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)', {visible: true})
      await this.page.click('div.JRtysb:nth-child(3) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)')
      await this.page.waitForTimeout(500)
      await this.page.waitForSelector('span.tHuOYd:nth-child(2) > div:nth-child(2) > div:nth-child(1)', {visible: true})
      await this.page.click('span.tHuOYd:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
      
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
      await this.page.click('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('A');
      await this.page.keyboard.up('Control');
      await this.page.keyboard.press('Backspace');

      await this.page.type('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header1)
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.HQ8yf:nth-child(1)', {visible: true})
      await this.page.click('div.HQ8yf:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.$eval('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', (el) => {
        el.setAttribute('maxlength', '1000')
      })
      await this.page.waitForSelector('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible:true})
      await this.page.type('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header2)
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.HQ8yf:nth-child(2)', {visible: true})
      await this.page.click('div.HQ8yf:nth-child(2)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)', {visible: true})
      await this.page.click('div.ThdJC:nth-child(1) > span:nth-child(2) > div:nth-child(1)')
      await this.page.waitForTimeout(200)
    } else {
      //jika bukan homepage
      await this.page.waitForTimeout(2500)
      await this.page.waitForSelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)', {visible: true})
      await this.page.evaluate(()=> {
        document.querySelector('div.ThdJC:nth-child(2) > span:nth-child(2) > div:nth-child(1)').click()
      })
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('span.Ip8zfc > span:nth-child(1)', {visible: true})
      await this.page.hover('span.Ip8zfc > span:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('.es0ex', {visible: true})
      await this.page.click('.es0ex')
      
      await this.page.waitForTimeout(200)
      
      await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
      await this.page.click('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
      await this.page.type('.WnONLb > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header1)
      await this.page.waitForTimeout(200)
      await this.page.waitForSelector('div.HQ8yf:nth-child(1)', {visible: true})
      await this.page.click('div.HQ8yf:nth-child(1)')
      await this.page.waitForTimeout(200)
      await this.page.$eval('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', (el) => {
        el.setAttribute('maxlength', '1000')
      })
      await this.page.waitForSelector('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible:true})
      await this.page.type('.RRvhed > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', header2)
      await this.page.waitForTimeout(200)
      
      await this.page.waitForSelector('div.HQ8yf:nth-child(2)', {visible: true})
      await this.page.click('div.HQ8yf:nth-child(2)')
      await this.page.waitForTimeout(800)
    }

    //back to insert submenu
    await this.page.waitForSelector('#yDmH0d > div.MUd2qe.gJ9tsd > div.vW7mGd.XM6wle.mkDbPd.M3Aaxc.NVNv2d.Y3eu4c > span > div > div.BFsh9 > div.mrslJ.ZjAUM.q21cab.H3UEIb > div:nth-child(1) > span > div', {visible: true})
    await this.page.click('#yDmH0d > div.MUd2qe.gJ9tsd > div.vW7mGd.XM6wle.mkDbPd.M3Aaxc.NVNv2d.Y3eu4c > span > div > div.BFsh9 > div.mrslJ.ZjAUM.q21cab.H3UEIb > div:nth-child(1) > span > div')
    await this.page.waitForTimeout(200)
    
    await header(header1);
    await inputSection2(title, author);
    await insertImg(linkimg); 
    await this.page.waitForTimeout(200)
      
    //section3
    await this.page.mouse.wheel({deltaY: 300})
    await this.page.waitForTimeout(500)
    await this.page.mouse.wheel({deltaY: 200})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(500)
    await this.page.keyboard.type('√')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.type('PDF | ')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.sendCharacter('√')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.type('KINDLE | ')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.sendCharacter('√')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.type('EPUB')
    await alignCenter()
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(500)
    await boldFont()
    await this.page.waitForTimeout(100)
    await this.page.keyboard.type('⇓⇓⇓')
    await this.page.waitForTimeout(100)
    await boldFont()
    await this.page.waitForTimeout(100)
    await alignCenter()
  
    //download button upper
    await downloadButton(textDownBt, linkDownBt)
    await headingLink('BOOK DETAILS:')
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    //Book details    
    await this.page.waitForSelector('.cQgVbe > div:nth-child(2) > div:nth-child(1) > div:nth-child(4)', {visible: true})
    await this.page.waitForTimeout(500)
    await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', {visible: true})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(500);
    await this.page.keyboard.type('Title : ')
    await boldFont()
    await this.page.keyboard.type(title)
    await boldFont()
    await this.page.keyboard.press('Enter')
    
    await this.page.keyboard.type('Author : ')
    await this.page.keyboard.type(author)
    await this.page.keyboard.press('Enter')
    
    await this.page.keyboard.type('Release : ')
    await this.page.keyboard.type(pages)
    //await page.keyboard.type(' pages')
    await this.page.keyboard.press('Enter')
    
    await this.page.keyboard.type('Category : ')
    await this.page.keyboard.type(publisher)
    await this.page.keyboard.press('Enter')
    await this.page.mouse.wheel({deltaY: 200})
    await this.page.keyboard.type('Language : ')
    await this.page.keyboard.type(language)
    await this.page.keyboard.press('Enter')
    await this.page.keyboard.type('Niche : ')
    await this.page.keyboard.type(isbn_10)
    await this.page.keyboard.press('Enter')
    await this.page.mouse.wheel({deltaY: 300})
    //await page.keyboard.type('ISBN-13 : ')
    //await page.keyboard.type(isbn_13)
    //await page.keyboard.press('Enter')
    await this.page.mouse.wheel({deltaY: 400})
    await this.page.waitForTimeout(200);
    await this.page.keyboard.down('Control');
    await this.page.waitForTimeout(300);
    await this.page.mouse.wheel({deltaY: 300})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(200)
    await boldFont()
    await this.page.waitForTimeout(100)
    await this.page.keyboard.type('⇓⇓⇓')
    await this.page.waitForTimeout(100)
    await boldFont()
    await this.page.waitForTimeout(100)
    await alignCenter()

    await insertImg(imgDownBt); 
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.bFhy9b > div:nth-child(3) > div:nth-child(1)', { visible: true })
    await this.page.click('.bFhy9b > div:nth-child(3) > div:nth-child(1)')
    await this.page.waitForTimeout(500)
    await this.page.waitForSelector('.YTWiWc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible: true})
    await this.page.click('.YTWiWc > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)')
    await this.page.waitForTimeout(200)
    await this.page.keyboard.type(linkDownBt)
    await this.page.waitForTimeout(200)
    await this.page.click('.Sd2wDb > div:nth-child(1)')
    await this.page.waitForTimeout(200)

    //heading link2
    await headingLink(title +' Review by '+ author)
    
    //keterangan2
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', {visible: true})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(200);
    await this.page.keyboard.type(description)
    await this.page.waitForTimeout(200);

    //subheading
    await this.page.waitForTimeout(200);
    await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', {visible: true})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(200);
    await this.page.keyboard.type(title +' by '+ author)
    await this.page.keyboard.down('Control');
    await this.page.keyboard.press('A');
    await this.page.keyboard.up('Control');
    await this.page.waitForTimeout(300);
    await this.page.waitForSelector('.vuEmub', {visible: true})
    await this.page.click('.vuEmub')
    await this.page.waitForTimeout(200);
    await this.page.waitForSelector('.nK92pf > div:nth-child(2) > div:nth-child(4)', {visible: true})
    await this.page.click('.nK92pf > div:nth-child(2) > div:nth-child(4)')
    await this.page.waitForTimeout(500)

    //Tags
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.zgFouf > svg:nth-child(1) > path:nth-child(1)', {visible: true})
    await this.page.click('.zgFouf > svg:nth-child(1) > path:nth-child(1)')
    await this.page.waitForTimeout(200);
    await this.page.keyboard.type('Tags: '+ title +' by '+ author +'Free download, epub, pdf, docs, New York Times, ppt, audio books, books to read, good books to read, cheap books, good books,online books, books online, book reviews, read books online, books to read online, online library, greatbooks to read, best books to read, top books to '+ title +' by '+ author +'book to read online.')

    //click publish bagian ini rubah auto nya
    let retry = 0, maxRetry = 5;
    while(retry < maxRetry) {
      try {
        await this.page.waitForTimeout(500)
        await this.page.waitForSelector('.UQuaGc', {visible: true}) // click publish pertama
        await this.page.click('.UQuaGc')
        await this.page.waitForTimeout(300);
        await this.page.waitForSelector('.jNgCIc > iframe:nth-child(2)', {visible: true}) //click publish k2 ( stuck)
        await this.page.click('.jzUkrb > div:nth-child(2)')
        break;
      } catch (error) {
        await this.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        console.log('Retry ..');
      }
    }
    


    //copy link 
    await this.page.waitForTimeout(300);
    await this.page.waitForSelector('.odraff > svg:nth-child(1)',{visible: true})
    // await page.click('.odraff > svg:nth-child(1)') 
    // id="ilet4c"

    await clickButtonWhenEnabled("#ilet4c");

    await this.page.waitForSelector('.ocNfZ > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', {visible:true})
    let weblink1 = await this.page.$eval('.ocNfZ > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(1)', el => {return el.getAttribute('value')})
    let weblink2 = {link: weblink1}
    console.log(weblink2)
    // linkdata.push(weblink2)
    console.log(linkdata)
    await this.page.waitForTimeout(200)
    await this.page.waitForSelector('.VY7JQd > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)', {visible: true})
    await this.page.click('.VY7JQd > div:nth-child(1) > span:nth-child(2) > span:nth-child(1) > svg:nth-child(1)')
    return weblink2
  }

  async start(){
    const linkdata = [];
    let isNewPage = true;
    try {
      await this.initBrowser();
      isNewPage = await this.initPage();
    } catch (error) {
      console.log('Gagal membuka browser:', (error.message || error));
      return 'Failed to open browser!';
    }
    for (const item of this.content) {
      let retry = 0, maxRetry = 3;
      while(retry < maxRetry) {
        try {
          const link = await this.createNewSite(item, isNewPage);
          linkdata.push(link);
          isNewPage = false;
          break;
        } catch (error) {
          console.log(`Percobaan ke-${retry + 1} error dengan pesan:`, (error.message || error));
          retry++;
        }
      }
      if (retry === maxRetry) isNewPage = await this.initPage();
    }
    console.log('Done, close browser ..');
    await this.browser.close();
    return linkdata;
  }
}

module.exports = SiteCreator;


(async () => {
  const fileContent = fs.readFileSync(path.join('C:/Users/hakir/Downloads/EBOOK ITUNES.csv'), { encoding: 'utf-8' });
  const content = fileContent.split('\n');
  const defaultTool = new SiteCreator(content, 'Default');
  const profileOneTool = new SiteCreator(content, 'Default');
  defaultTool.start();
  setTimeout(() => {
    profileOneTool.start();
  }, 1000 * 3);
})()
