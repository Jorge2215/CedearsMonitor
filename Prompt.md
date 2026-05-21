# Cedears Monitor - Prompt 1

## Role
Act as a senior full-stack web developer specialized in React and modern cloud deployment practices, with deep experience in financial applications development.

## Context
We need to build a responsive web application that allows users to analyze the historical price evolution of CEDEARs (Argentinian certificates of foreign stocks).  
The App Name must be **"Cedears Monitor"**.

## Objective
Create a dynamic web application that enables users to:
- Select a CEDEAR ticker from a predefined list.
- Retrieve its historical price data from an external API.
- Display the data in both tabular and graphical formats.

## Functional Requirements

### 1. User Interface
- Provide a dropdown list populated from `CedearsList.json` (fields: "Ticket", "Company").
- Include a "Consultar" button to trigger data retrieval.
- Default time frame: current year. Allow custom time frame selection via calendar controls.
- Display results in:
  - A **Grid/Table** with columns: Date, Open, High, Low, Close.
  - A **Line Chart** showing price evolution over the selected period.
- UI must be responsive, modern, and clean, using light colors.

### 2. Data Retrieval
- Use REST API endpoint:  
  `https://data912.com/historical/cedears/{ticker}`
- Replace `{ticker}` with the selected value (e.g., MSFT).
- API returns JSON with historical price data.
- Cedears list must be loaded from `CedearsList.json` located in `/src/data`.

### 3. Data Structure (API Response Example)
Each record contains:
- `date`: string (YYYY-MM-DD)
- `o`: opening price
- `h`: highest price
- `l`: lowest price
- `c`: closing price

### 4. Technical Requirements
- Frontend: React + modern charting library (e.g., Chart.js, Recharts).
- Backend: Node.js or serverless functions (if needed for proxy/auth).
- Deployment: Azure Static Web Apps.
- Code must be modular, documented, and production-ready.
- Use English labels consistently (`Ticket`, `Company`).

## Deliverables
- Source code in GitHub repository.
- Clear README with setup and deployment instructions.
- Working demo deployed in Azure (`https://<appname>.azurestaticapps.net`).
- Automated tests included in CI/CD pipeline.

## Repository & Branching Strategy
- Repository: [https://github.com/Jorge2215/CedearsMonitor](https://github.com/Jorge2215/CedearsMonitor)
- `.gitignore`: React + .NET 10 solution.
- Branches:
  - `main`: production-ready code.
  - `dev`: integration branch.
- Workflow:
  - Features in `feature/*` branches (e.g., `feature/historical-chart`).
  - Pull Requests into `dev`, then merge into `main` after validation.
- CI/CD:
  - GitHub Actions deploys `main` to Azure Static Web Apps.
  - `dev` deploys to staging.
  - Automated tests must run before deployment.
- Commit convention: use prefixes (`feat:`, `fix:`, `docs:`).

## Prompt 2 - Mejorando la UI
## Visual Enhancement Request

Objective:
Improve the visual design of Cedears Monitor to make it more modern, clean, and attractive.

Requirements:
- Integrate a UI framework (Material UI or Chakra UI preferred).
- Apply a light color palette (white background, pastel accents, modern typography).
- Style the Grid/Table with alternating row colors and hover effects.
- Enhance the Line Chart with gradient colors and clear tooltips.
- Add a loading spinner when fetching data.
- Ensure responsiveness and accessibility across devices.

## Prompt 3

# Cedears Monitor - Visual Enhancement Prompt

## Objective
Transform the current Cedears Monitor app into a visually modern, attractive, and user-friendly experience.  
The goal is to move beyond the "beta look" and deliver a polished interface that inspires confidence and enjoyment.

## Requirements

### 1. UI Framework
- Integrate a modern UI framework:
  - **Material UI (MUI)** or **Chakra UI** (preferred).
  - Alternatively, **Tailwind CSS** for flexible styling.

### 2. Color Palette
- Use a **light, clean background** (white or very light gray).
- Apply **bright, cheerful primary colors** (turquoise, lime green, coral).
- Add **pastel secondary accents** (lavender, yellow, soft pink).
- Ensure good contrast and accessibility.

### 3. Typography
- Adopt a modern, readable font (e.g., *Inter*, *Roboto*, *Poppins*).
- Use consistent sizes and weights for headings, labels, and body text.

### 4. Components Styling
- **Buttons**: rounded corners, vibrant colors, hover effects.
- **Table**: striped rows with soft alternating colors, hover highlight, styled header with primary color.
- **Chart**: gradient line colors, smooth animations, clear tooltips.
- **Loading state**: add a spinner or progress bar with modern animation.

### 5. Layout & Identity
- Add a **header bar** with the app name and optional logo/icon.
- Ensure responsive design across desktop, tablet, and mobile.
- Maintain a clean, minimalistic layout with spacing and alignment.

## Deliverables
- Updated UI integrated with chosen framework.
- Consistent color theme applied across all components.
- Enhanced user experience with loading indicators and animations.
- Responsive design validated on multiple screen sizes.

## Prompt 4

# Cedears Monitor - Dropdown Search Enhancement Prompt

## Objective
Improve the CEDEAR selection experience by adding a search capability to the dropdown list.  
Users should be able to type part of the company name or ticker to quickly find the desired CEDEAR.

## Requirements

### 1. Dropdown Behavior
- Replace the current static dropdown with a **searchable dropdown** (autocomplete).
- Allow users to:
  - Type part of the company name (e.g., "Garmin") or ticker (e.g., "GRMN").
  - See filtered results dynamically as they type.
  - Select the CEDEAR from the filtered list.

### 2. UI Framework Integration
- Use a modern UI component from the chosen framework:
  - **Material UI**: `Autocomplete` component.
  - **Chakra UI**: `Combobox` or `Select` with search.
  - **Ant Design**: `Select` with `showSearch` enabled.

### 3. User Experience
- Maintain the current dropdown style (light, clean, modern).
- Ensure accessibility: keyboard navigation (arrow keys, enter).
- Provide clear placeholder text: *"Search CEDEAR by name or ticker..."*.
- Highlight matching text in the results for clarity.

### 4. Data Source
- Continue using `CedearsList.json` as the source of tickers and companies.
- Ensure filtering works on both fields: `"Ticket"` and `"Company"`.

### 5. Responsiveness
- Validate that the searchable dropdown works smoothly on desktop, tablet, and mobile.
- Ensure no overlap or clipping with other UI elements.

## Deliverables
- Updated dropdown component with search functionality.
- Integrated with existing CEDEAR list JSON.
- Tested across devices for responsiveness and accessibility.


## Prompt 5

# Cedears Monitor - New Features Prompt

## Objective
Expand the capabilities of the Cedears Monitor application by adding:
1. Data export to CSV/Excel.

## 1. Data Export

### Requirements
- Add a visible button in the interface: **"Export Data"**.
- Allow exporting the data shown in the chart and table to:
  - **CSV** (for quick analysis).
  - **Excel (.xlsx)** (for spreadsheet use).
- Include in the file:
  - Date.
  - Closing price.
  - Volume (if available).
- File name format: `Cedear_<Ticker>_<Date>.csv` or `.xlsx`.

### User Experience
- Place the button near the chart or table.
- Show confirmation message: *"Data exported successfully"*.
- In case of error, show a clear alert.


## Deliverables
- Functional export button generating CSV/Excel files.
- Validation on desktop and mobile.
- Short documentation explaining how to use each new feature.

## Prompt 6

# Hidden message
Objective:
Add an allegorical functionality to the Cedears Monitor application:
- Display a circular image (2.5 cm diameter) on the top blue bar, aligned to the right.
- When the user performs a double click on the image, show a visually pleasant card containing a paragraph from Haruki Murakami's novel "The Wind-Up Bird Chronicle."

Squad Tasks:
1. Circular Image:
   - Use the image stored in the \Images folder of the local repository with name "WindupBird.jpg"
   - Render it as a circle using CSS (border-radius: 50%, fixed size 2.5 cm).
   - Position it on the top blue bar, aligned to the right.

2. Double Click Event:
   - Implement a double click listener on the image.
   - When triggered, display a card (modal or floating div) with the following text:

     “The point is, not to resist the flow. You go up when you're supposed to go up and down when you're supposed to go down. When you're supposed to go up, find the highest tower and climb to the top. When you're supposed to go down, find the deepest well and go down to the bottom. When there's no flow, stay still. If you resist the flow, everything dries up. If everything dries up, the world is darkness.”

3. Card Visual Style:
   - Light background (#f9f9f9 or similar).
   - Rounded corners (12px).
   - Soft shadow (box-shadow).
   - Typography consistent with the application (Segoe UI or similar).
   - Max width: 400px, centered on screen.
   - Text with line-height 1.5 for readability.

Deliverables:
- Updated source code in the repository.
- Screenshot showing the circular image on the top bar.
- Screenshot of the card with Murakami’s text.
- Short README documentation explaining how the functionality was implemented.

Success Criteria:
- The image is correctly displayed as a circle in the specified position.
- Double click event successfully triggers the card with the full text.
- The card’s visual style is consistent and pleasant, aligned with the application’s design.



## Squad Resume
copilot --resume=72cf2c74-876d-4f62-b44b-e64f3df35866