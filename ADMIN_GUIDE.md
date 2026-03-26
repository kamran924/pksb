# PKSB Website Admin Guide

Welcome! This guide explains how to manage your website content without editing HTML files.

## Accessing the Admin Dashboard

1. Go to `admin-login.html` on your website (or click the "Admin" link in the header)
2. Log in with your email and password
3. You'll see the admin dashboard with different content sections

## Managing Content

### Adding Events

1. Click **Events** in the sidebar
2. Fill in the event details:
   - **Event Title**: Name of the event (e.g., "Eid Celebration")
   - **Date & Time**: When the event takes place
   - **Location**: Where the event happens
   - **Description**: Details about the event
   - **Image** (optional): Upload a photo for the event
3. Click **Create Event**
4. The event will appear on your website immediately

### Posting News & Updates

1. Click **News** in the sidebar
2. Fill in the news details:
   - **News Title**: Headline for your update
   - **Description**: Full details of the news
   - **Image** (optional): Add a photo
3. Click **Post News**
4. The news appears on the homepage instantly

### Managing Team Members

1. Click **Team** in the sidebar
2. Add team member details:
   - **Name**: Full name
   - **Role**: Position or role (e.g., "Coordinator")
   - **Description** (optional): Bio or brief background
   - **Image** (optional): Profile photo
3. Click **Add Member**
4. Team members will display on the About page

### Editing About Section

1. Click **About** in the sidebar
2. Create sections like:
   - "About Us"
   - "Mission"
   - "Vision"
   - "Goals"
3. Each section has its own title and content
4. Click **Save Section** to update
5. Content appears on the About page

## Image Upload

- Images are stored in the `images/` folder
- Supported formats: JPG, PNG, GIF, WebP
- Images are automatically named with timestamps to avoid conflicts
- Display automatically resizes images for responsive viewing

## Editing Existing Content

- **Events**: Click **Edit** to modify event details or **Delete** to remove
- **News**: Click **Edit** or **Delete** any news item
- **Team**: Click **Edit** or **Delete** team member profiles
- **About**: Click **Edit** to update any section

## Tips

- Content changes appear on your website **immediately** (no publishing needed)
- Delete with caution - deleted items cannot be recovered
- Use clear, descriptive titles for better organization
- Add images to make content more visually appealing
- Keep descriptions concise and engaging

## Technical Details

The website uses:
- **Supabase**: A secure database for storing all content
- **Dynamic Loading**: Pages automatically fetch the latest content
- **No Static HTML**: Content is managed through this dashboard, not by editing files

## Troubleshooting

**Can't login?**
- Verify your email and password are correct
- Contact the website administrator if you forgot your credentials

**Images not showing?**
- Ensure the image format is supported (JPG, PNG, GIF, WebP)
- Try uploading again if the upload fails

**Changes not appearing?**
- Refresh the webpage in your browser
- Clear your browser cache and try again

---

For questions or support, contact the website administrator.
