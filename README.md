# Corner Boy Deli

A dark, mobile-first NYC bodega menu and pickup ordering site. Build sandwiches with bread, cheese, toppings, sauces, extras and notes; edit quantities in the bag; preview and copy a readable order or open an SMS composer.

## Run locally

No build step or dependencies. Serve this directory with any static web server, for example `python3 -m http.server 8080`.

## Store setup

Edit `config.js` to set the store name and SMS-capable phone number, formatted with country code. The initial number **800-555-5555 is a placeholder**; set `placeholder: false` when using a real number. Update the displayed phone number too.

Menu prices are in cents in `app.js`. Prices are sample prices, before applicable taxes, with final pricing and pickup timing confirmed by the store. Sending a text requires the customer to confirm/send in their messaging app; the site does not silently submit orders or process payments. SMS links use the iOS/Android body separator; customers can copy the order when their device has no SMS handler.

## Deploy

GitHub Pages serves the repository root on the main branch. All local asset paths are relative, supporting GitHub project sites. `.nojekyll` disables Jekyll processing.

## Menu inspiration

This is a fictional store, not affiliated with the restaurants below. Menu research on October 3, 2026:

- [Blue Sky Deli / Hajji’s](https://www.doordash.com/store/blue-sky-deli-new-york-31641513/) — original chopped cheese.
- [Yankee Deli](https://www.allmenus.com/ny/new-york/837088-yankee-deli/menu/) — chopped cheese, buffalo chicken, chicken cutlet.
- [Chop Cheese Deli](https://www.allmenus.com/ny/new-york/604473-chop-cheese-deli/menu/) — cutlets, BBQ chicken, sausage/egg/cheese.
- [Frankel’s](https://frankelsdelicatessen.com/order/frankel-s-delicatessen-631-manhattan-ave/item-bacon-egg-cheese_ab1a9c59-b2b8-45ef-bee5-f5556aafa3fc) — bacon/egg/cheese and bagel deli inspiration.

Food photograph generated for this site. Fonts: DM Sans and Barlow Condensed via Google Fonts, with local system fallbacks.
