var headless_mode = process.argv[2]

const readline = require('readline');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const cron = require("node-cron");
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

size='Medium'

fullName='Dionisis Koutsourakis'
email='diodimi14@gmail.com'
tel='6986815915'
address='Tilefanous 21'
address2='Kolonos'
address3='Attiki'
city='Athens'
postcode='10442'
number='4165810006860196'
cvv='012'


async function run () {
  const browser = await puppeteer.launch({
	executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless:(headless_mode !== 'true')? false : true,
    ignoreHTTPSErrors: true,
    slowMo: 0,
    args: ['--window-size=1400,900',
    '--remote-debugging-port=9222',
    "--remote-debugging-address=0.0.0.0", // You know what your doing?
    '--disable-gpu', "--disable-features=IsolateOrigins,site-per-process", '--blink-settings=imagesEnabled=true'
    ]})

  const page = await browser.newPage();
  page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.0 Safari/537.36")

  console.log(`Opening`)

//   Product category
  await page.goto('https://www.supremenewyork.com/shop/all/tops_sweaters')


  const query = "Zip Up";

		page.evaluate(query => {
			const elements = [...document.querySelectorAll('a.name-link')];
		
			// Either use .find or .filter, comment one of these
			// find element with find
			const targetElement = elements.find(e => e.innerText.includes(query));
		
			// OR, find element with filter
			// const targetElement = elements.filter(e => e.innerText.includes(query))[0];
		
			// make sure the element exists, and only then click it
			targetElement && targetElement.click();
		}, query)
  
  		await page.waitForSelector('select[name="size"]');
	
		await page.evaluate(() => {
			const example = document.querySelector('#size');
			const example_options = example.querySelectorAll('option');
			const selected_option = [...example_options].find(option => option.text === 'Medium');
			
			
			selected_option.selected = true;
		  });
		// await page.select('#size', '75494')
		// await page.waitFor(5000);;

		console.log("Choosing size")

		await page.evaluate(() => 
		document.querySelectorAll('input[name="commit"]')[0].click()
		)

		await page.waitForSelector('a[class="button checkout"]');
		
		await page.evaluate(() => 
		document.querySelectorAll('a[class="button checkout"]')[0].click()
		)
		

		console.log('Checkout')

		await page.waitForSelector('a[class="button checkout"]');
		
		await page.evaluate(() => 
		document.querySelectorAll('a[class="button checkout"]')[0].click()
		)
		

		console.log('Checkout')
		

		await page.waitForSelector('.order_billing_name');
		
			
		// Username
		await page.focus('.order_billing_name > input');
		await page.keyboard.type(fullName);
		
		await page.focus('.order_email > input');
		await page.keyboard.type(email);

		await page.focus('.order_tel > input');
		await page.keyboard.type(tel);
		// await page.waitFor(500);;
		await page.type('input[id=bo]', address);
		await page.type('input[id=oba3]', address2);
		await page.type('input[id=order_billing_address_3]', address3);
		await page.type('input[id=order_billing_zip]', postcode);
		await page.type('input[id=cnb]', number);
		await page.type('input[id=vval]', cvv);
		await page.type('input[id=order_billing_city]', city);
		// await page.type('input[id=cnb]', number, {delay: 20})
		await page.select('#order_billing_country', 'GR')
		await page.select('#credit_card_month', '04')
		await page.select('#credit_card_year', '2024')


		await page.evaluate(() => 
		document.querySelectorAll('input[class="checkbox"]')[0].click()
		)

		await page.evaluate(() => 
		document.querySelectorAll('input[type="submit"]')[0].click()
		)


}

// 10 AM
// 0 10 * * * 
// cron.schedule("30 23 * * *", () => {
	// cron.schedule("1 6 * * *", () => {
	// 	run();
	// });

// cron.schedule("0 13 * * *", () => {
	run();
// });
