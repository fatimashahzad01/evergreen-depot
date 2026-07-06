#!/bin/bash
echo "Creating all remaining React component files..."

# Create remaining page files
for file in Cart Checkout Login Register About Contact; do
  touch client/src/pages/${file}.js
done

# Create user pages
for file in Dashboard Orders Profile Wishlist; do
  touch client/src/pages/user/${file}.js
done

# Create admin pages
for file in Dashboard Products Orders Users; do
  touch client/src/pages/admin/${file}.js
done

echo "All files created successfully!"
ls -la client/src/pages/
