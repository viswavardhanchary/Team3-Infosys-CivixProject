# 🏛️ Team3 - Infosys Civix Project

**Civix** is a citizen engagement platform that empowers people to participate in local governance through **petitions, voting, and issue tracking**.  
It promotes **community-driven advocacy** by enabling **geo-targeted issues**, **polls**, and **public sentiment analysis** to make civic interaction more transparent and effective.

## Live Website Link:- https://civix-team3.onrender.com/

## 🌟Features

- **Create & Sign Petitions:** Citizens can start or support petitions for local issues.  
- **Voting System:** Engage in polls to voice public opinion.  
- **Geo-targeted Issues:** Focus on problems affecting your specific area or region.  
- **Track Officials’ Responses:** Monitor how officials respond to petitions or public requests.  
- **Community Interaction:** Comment, discuss, and share updates with others.  
- **Data Visualization:** View statistics on petitions, participation, and sentiment trends.  
- **Secure Authentication:** Role-based login for citizens and officials.


## Tech Stack

**Frontend:** React.js, TailWind CSS, JavaScript  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**APIs:** GeoLocation API, RESTful APIs  
**Tools & Others:** Git, GitHub, VS Code, Render (for deployment)


## Installation & Setup

Follow these steps to set up the project locally:

 1. **Clone the repository**
   
     ```bash
     git clone https://github.com/viswavardhanchary/Team3-Infosys-CivixProject.git
     ```
 2. **Change Directory**

     ```bash
     cd Team3-Infosys-CivixProject
     ```
 3. **Frontend**
    
     ```bash
     cd Frotend
     npm install
     npm run dev
     ```
 4. **Backend**
     First Create a .env file include
    
     ```bash
       MONGOURI = your_mongodb_connection_string
       PORT = 5000
       SALT = 12
       JWT_SECRET = your_secret_key
     ```
    Then Follow this commands
    
    ```bash
      cd Backend
      npm install
      node server.js
    ```
  6. **Update cors policy in server.js**<br>
     Find the line:- **app.use(cors({ origin : ["http://civix-team3.onrender.com"]}))**<br>
     update it with frontend url like<br>
     
     ```bash
       app.use(cors({ origin : ["http://localhost:1573"]}))
     ```
7. **Update baseURL in Frontend**<br>
     Go to the path Frontend/src/axios/api.js<br>
     update baseURL as<br>
     
     ```bash
       http://localhost:5000
     ```
## Team Members:-<br>
  1) Name:-     **Enjeti Viswa Vardhan Chary**<br>
     Role:-     **Full Stack Developer**<br>
     Email:-    **viswavardhanchary@gmail.com**<br>
     LinkedIn:- **https://www.linkedin.com/in/viswa-vardhan-chary**<br>
     GitHub:-   **https://github.com/viswavardhanchary**<br>
     
 2)  Name:-     **Doddi Mahendra**<br>
     Role:-     **Full Stack Developer**<br>
     Email:-    **mahendra8143411340@gmail.com**<br>
     LinkedIn:- **https://www.linkedin.com/in/mahendra-doddi-015a90270**<br>
     GitHub:-   **https://github.com/MAHENDRAAUCSE**<br>

 3)  Name:-     **Pammi Lakshitha**<br>
     Role:-     **Frontend**<br>
     Email:-    **lakshithasrinivasan.p@gmail.com**<br>
     LinkedIn:- **https://www.linkedin.com/in/lakshitha-pammi-925647375**<br>
     GitHub:-   **https://github.com/lakshithasrinivasan**<br>
     
 4)  Name:-     **Ashwini N**<br>
     Role:-     **Frontend**<br>
     Email:-    **ashwini1409nagarajan@gmail.com**<br>
     LinkedIn:- **https://www.linkedin.com/in/ashwini-n-b1bb63275**<br>
     GitHub:-   **https://github.com/Ashwini14092003**<br>

 5)  Name:-     **Midivelli Teja Sri**<br>
     Role:-     **Frontend**<br>
     Email:-    **midivellitejasri543@gmail.com**<br>
     LinkedIn:- **https://www.linkedin.com/in/m-tejasri-0199a830b/**<br>
     GitHub:-   **https://github.com/MIDIVELLITEJASRI**<br>

 6)  Name:-     **Sangram Singh**<br>
     Role:-     **UI, Design, Frontend**<br>
     Email:-    **sangram0960@gmail.com**<br>
     GitHub:-   **https://github.com/Sangram9351**<br>


   

   

