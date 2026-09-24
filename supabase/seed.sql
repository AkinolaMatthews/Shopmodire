-- Optional: run this after schema.sql to pre-fill the catalog with the
-- original 7 starter products (with placeholder image URLs). You can
-- also just add products through the admin panel instead.

insert into products (name, category, price, description, colors, sizes, image_url, is_new) values
('Lagos Print Scrub Top', 'Scrubs', 48.00,
 'A relaxed-fit scrub top finished with a bold Lagos-heritage print trim at the collar and cuffs. Soft stretch fabric that moves with a full shift.',
 array['Burgundy','Charcoal','Ivory'], array['XS','S','M','L','XL','XXL'],
 '', true),

('Delta Heritage Scrub Top', 'Scrubs', 48.00,
 'V-neck scrub top with Delta-heritage trim detailing and a hidden utility pocket. Built for long shifts without losing its shape.',
 array['Gold','Charcoal'], array['XS','S','M','L','XL'],
 '', false),

('Lagos Print Scrub Pant', 'Scrubs', 44.00,
 'Jogger-cuffed scrub pant with an elastic drawstring waist and side print panelling that matches the Lagos Print Scrub Top.',
 array['Burgundy','Charcoal'], array['XS','S','M','L','XL','XXL'],
 '', false),

('Lagos Heritage Scrub Cap', 'Scrub Caps', 22.00,
 'Handmade 100% cotton tie-back scrub cap in our signature Lagos Heritage print. Adjustable fit, breathable all shift long.',
 array['Burgundy/Gold'], array['One Size'],
 '', true),

('Delta Heritage Scrub Cap', 'Scrub Caps', 22.00,
 'Handmade tie-back scrub cap in the Delta Heritage print, with a soft inner sweatband for comfort during long shifts.',
 array['Gold/Charcoal'], array['One Size'],
 '', false),

('Colorful Cuff Medical Jogger', 'Joggers', 46.00,
 'Stretch medical jogger with a contrast African-print cuff and waistband. Tapered fit that stays professional on the floor.',
 array['Charcoal','Navy'], array['XS','S','M','L','XL','XXL'],
 '', false),

('Heritage Waistband Jogger', 'Joggers', 46.00,
 'Our most requested jogger — deep pockets, four-way stretch fabric, and a heritage-print waistband peeking through the drawstring.',
 array['Burgundy','Charcoal'], array['S','M','L','XL'],
 '', true);

-- The image_url values are left blank -- open each product in /admin and
-- upload a real photo, or update image_url directly with a URL.
