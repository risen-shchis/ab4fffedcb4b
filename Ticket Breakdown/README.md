# Ticket Breakdown

<details><summary><code>Challenge Description</code></summary>
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".

You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

</details>

### Overview 🎯

- We should create a table to store the mapping between internal and `Facility`'s `Agent`'s IDs.
- We should update the `getShiftsByFacility` function to use the `Facility`'s `Agent`'s IDs instead of the internal `Agent`'s ID.
- We should add a UI on the frontend for `Facility`'s to set their custom IDs for `Agents`.
- We should add an API endpoint to set/read/update/clear these custom IDs.

### Assumptions 🤔

- We assume that we can keep the implementation of `generateReport` if we just provide needed `Agent`'s IDs in the list of `Shifts` (that is returned from `getShiftsByFacility`).
- For simplicity, we will cover only initial MVP tickets for the feature (and won't cover tickets for _QA, documentation, deployment, feature flagging, collection, and monitoring of new metrics, marketing announcements, etc._).
- We will use a T-Shirt Sizing scale for relative time/effort estimation of a ticket.

  <div>
    <table>
      <tr>
        <td align="center">
          <code>XS</code>
        </td>
        <td>< 4 hours</td>
      </tr>
      <tr>
        <td align="center">
          <code>S</code>
        </td>
        <td>4–8 hours</td>
      </tr>
      <tr>
        <td align="center">
          <code>M</code>
        </td>
        <td>1–2 days</td>
      </tr>
      <tr>
        <td align="center">
          <code>L</code>
        </td>
        <td>2–4 days</td>
      </tr>
    </table>
  </div>

### Implementation Plan 📋

- Frontend and Backend should first agree on the API.
- Frontend can start implementing its UI (using mocked responses).
- Backend should add the new table.
- Backend should implement CRUD API for IDs mapping.
- After this work is done, QA can start testing the UI and API.
- Backend should update `getShiftsByFacility` function.
- After that, QA can start testing the reports' generation flow.

---

<table>
	<tr>
		<td>
			<h2>Backend Tickets</h2>
		</td>
	</tr>
</table>

### Ticket 1: Create a new `Agent IDs Mapping` table (to store the one-to-many mapping between the internal one and many `Facility`'s `Agent`'s IDs)

<table>
  <tbody>
    <tr>
      <td><code><b>S</b></code></td>
      <td>
        <b>Acceptance Criteria</b>
        <ul>
          <li>A new table is created.</li>
          <li>
            It has at least the following columns:
            <code>facility_id</code>, <code>facility_agent_id</code>,
            <code>internal_agent_id</code>.
          </li>
          <li>
            The primary key is a composite key made up of the
            <code>facility_id</code> and <code>facility_agent_id</code> columns.
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Ticket 2: Create CRUD API for the `Agent IDs Mapping` table

<table>
  <tbody>
    <tr>
      <td><code><b>L</b></code></td>
      <td>
				<p><b>Blocked by ticket #1.</b> 🛑</p>
        <b>Acceptance Criteria</b>
        <ul>
          <li>A new <code>agent_mapping</code> endpoint is created.</li>
          <li>
            It allows different methods for setting, retrieving, updating, and clearing of <code>Agent</code> IDs mapping (e.g., <code>POST</code>, <code>GET</code>, <code>PATCH</code>, <code>DELETE</code>).
          </li>
          <li>
            All these methods accepts list of inputs and return list of results (so the client can retrieve/set/… multiple IDs with one request).
          </li>
          <li>
            <code>POST</code> method
						<ul>
							<li>→ accepts <code>facility_id</code>, <code>facility_agent_id</code>, and <code>internal_agent_id</code>;</li>
							<li>← creates a new mapping.</li>
						</ul>
          </li>
          <li>
            <code>GET</code> method
						<ul>
							<li>→ accepts <code>facility_id</code>, and <code>internal_agent_id</code>;</li>
							<li>
								← returns 
								<ul>
									<li><code>facility_agent_id</code> <i>(<code>Facility</code>'s ID for specific <code>Agent</code>, if the mapping exists)</i></li>
									<li>or<code>internal_agent_id</code> <i>(if the mapping doesn't exist)</i>.</li>
								</ul>
							</li>
						</ul>
          </li>
          <li>
            <code>PATCH</code> method behaves similar to <code>POST</code> method, but updates the existing mapping.
          </li>
					<li>
            <code>DELETE</code> method
						<ul>
							<li>→ accepts <code>facility_id</code>, and (<code>facility_agent_id</code> or <code>internal_agent_id</code>);</li>
							<li>← deletes specific mapping.</li>
						</ul>
          </li>
        </ul>
        <b>Implementation Details</b>
        <ul>
          <li>The API should use ORM (e.g., Prisma).</li>
          <li>The API should implement error handling and input validation.</li>
					<li>From a security standpoint, it should behave similar to other APIs in the project and should be available only to authenticated users (e.g., with Bearer Authentication).</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Ticket 3: Update `getShiftsByFacility` method to return `facility_agent_id` (instead of internal) in `Shift`'s metadata (when it is set)

<table>
  <tbody>
    <tr>
      <td><code><b>M</b></code></td>
      <td>
				<p><b>Blocked by ticket #2.</b> 🛑</p>
        <b>Acceptance Criteria</b>
        <ul>
          <li>The <code>getShiftsByFacility</code> function works the same way, except that in now never includes internal <code>Agent</code>'s ID if the caller's <code>Facility</code> set a custom one for that <code>Agent</code>.</li>
          <li>If caller's <code>Facility</code> didn't set a custom ID for the <code>Agent</code>, the function continues to include in its response this <code>Agent</code>'s internal ID as before.</li>
        </ul>
        <b>Implementation Details</b>
        <ul>
          <li>We may want to optimize calls to the new <code>GET /agent_mapping</code> so that we receive all necessary mappings for this list of <code>Shifts</code> in one call.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

<table>
	<tr>
		<td>
			<h2>Frontend Tickets</h2>
		</td>
	</tr>
</table>

### Ticket 4: Build a UI for `Facilities` to CRUD custom `Agent`'s IDs

<table>
  <tbody>
    <tr>
      <td><code><b>L</b></code></td>
      <td>
				<p><b>Can be developed independently. But should be deployed after (or together) with ticket #2.</b> ⚠️</p>
        <b>Acceptance Criteria</b>
        <ul>
          <li>An edit button is added next to each <code>Agent</code>'s ID on the page where the <code>Facility</code> see its Agents.</li>
          <li>When the user clicks on that button, <code>Agent</code>'s ID becomes editable. Button changes to submit button.</li>
          <li>When user presses <kbd>Enter</kbd> or clicks on the submit button, API calls from ticket #2 are called to perform the desired action.</li>
					<li>When the user presses <kbd>Esc</kbd> or clicks outside the edit area, the edit mode is cancelled.</li>
					<li>When the <code>Agent</code>'s ID is set, a delete button appears next to the edit button.</li>
					<li>The UI is optimistically updated so that the user sees the result of the action immediately.</li>
        </ul>
        <b>Implementation Details</b>
        <ul>
          <li>Can be developed in parallel with tickets #1 and #2. May require mocking of new API calls.</li>
          <li>If the view becomes too cluttered with new buttons, consider showing them only on hover (or focus from keyboard).</li>
          <li>Validate user's inputs and handle errors from API calls.</li>
          <li>Handle keyboard focus/navigation, so that it would be easier for the user to CRUD IDs for several <code>Agents</code> without leaving keyboard mouse.</li>
          <li>Consider accessibility of the UI.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
