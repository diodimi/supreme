import {info} from './personal-info.js'

var headless_mode = process.argv[2]

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const category_url=info.category_url
const fullName=info.fullName
const email=info.email
const tel=info.tel
const address=info.address
const address2=info.address2
const address3=info.address3
const city=info.city
const postcode=info.postcode
const number=info.number
const cvv=info.cvv
const month=info.month
const year=info.year
const country=info.country
const keyWord=info.keyWord;

async function run () {
	const browser = await puppeteer.launch({
		executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
	await page.goto(category_url)


	page.evaluate(keyWord => {
		const elements = [...document.querySelectorAll('a.name-link')];
			
		// Either use .find or .filter, comment one of these
				// find element with find
		const targetElement = elements.find(e => e.innerText.includes(keyWord));
			
		// OR, find element with filter
		// const targetElement = elements.filter(e => e.innerText.includes(keyWord))[0];
		// make sure the element exists, and only then click it
		targetElement && targetElement.click();

	}, keyWord)
	
	await page.waitForSelector('select[name="size"]');
	await page.evaluate(() => {
		const example = document.querySelector('#size');
		const example_options = example.querySelectorAll('option');
		const selected_option = [...example_options].find(option => option.text === 'Medium');
		
		selected_option.selected = true;

	});


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

		
	await page.focus('.order_billing_name > input');
	await page.keyboard.type(fullName);

	await page.focus('.order_email > input');
	await page.keyboard.type(email);
	await page.focus('.order_tel > input');
	await page.keyboard.type(tel);
	// await page.waitFor(500);
	await page.type('input[id=bo]', address);
	await page.type('input[id=oba3]', address2);
	await page.type('input[id=order_billing_address_3]', address3);
	await page.type('input[id=order_billing_zip]', postcode);
	await page.type('input[id=cnb]', number);
	await page.type('input[id=vval]', cvv);
	await page.type('input[id=order_billing_city]', city);

	await page.select('#order_billing_country', country)
	await page.select('#credit_card_month', month)
	await page.select('#credit_card_year', year)

	// Accept Terms
	await page.evaluate(() => 
	document.querySelectorAll('input[type="checkbox"]')[0].click()
	)

	// Process Payment
	await page.evaluate(() => 
	document.querySelectorAll('input[type="submit"]')[0].click()
	)


}

// Set time

// cron.schedule("0 13 * * *", () => {
	run();
// });
