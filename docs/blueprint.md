# **App Name**: BookIt

## Core Features:

- Experience Listing: Display a list of bookable experiences with key details like title, location, price, image, and next available slot.
- Experience Details: Show detailed information for a selected experience, including description, duration, available slots, and booking options.
- Slot Selection: Allow users to choose a specific time slot for the experience they want to book. Each slot displays its remaining capacity.
- Checkout Form: Collect necessary booking information such as name, email, phone number (optional), and number of guests.
- Promo Code Validation: Enable users to apply a promo code to their booking and validate it against the subtotal to calculate discounts.  Utilizes a 'tool' to dynamically fetch the current values to correctly compute discounts.
- Booking Confirmation: Process bookings, decrement slot availability, and confirm the booking. Prevent double-booking and over-booking using transactions. Show booking details on success, or error messages on failure.
- Data Storage: Store data to a SQL database using prisma.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5), evoking trust and sophistication, aligning with a booking service's reliability.
- Background color: Light indigo (#E8EAF6), creating a calm, unobtrusive backdrop that enhances focus on the content.
- Accent color: Royal blue (#303F9F), provides a contrasting but harmonious element to draw attention to key interactive elements.
- Body and headline font: 'Inter', a sans-serif font offering a clean, modern aesthetic suitable for both headlines and body text. 
- Code font: 'Source Code Pro' for any displayed code snippets.
- Use consistent, minimalist icons throughout the app to represent different categories, actions, and information, improving usability and visual appeal.
- Implement a grid-based layout to ensure consistent spacing and alignment across different screen sizes. Use a maximum width to keep content readable.
- Incorporate subtle transitions and animations for a smooth user experience. Examples: fading effects for loading states and slide-in effects for displaying booking details.