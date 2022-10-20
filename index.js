const HTMLParser = require('node-html-parser');
const axios = require('axios');
const fs = require("fs");

async function getGenEd() {
  try {
    const response = await axios.get('https://molloy.smartcatalogiq.com/en/2020-2021/Undergraduate-Catalog/Curriculum-for-Degree-Requirements/General-Education-and-Core-Courses/General-Education-Courses-and-Program-Policies');

    const parseBody = HTMLParser.parse(response.data);

    const allResults = [];

    const href = parseBody.querySelectorAll("li.narrativeCourseTable a").map(x => x.getAttribute("href"))

//     const res = await axios.get("https://molloy.smartcatalogiq.com/2020-2021/Undergraduate-Catalog/Curriculum-for-Degree-Requirements/General-Education-and-Core-Courses/General-Education-Courses-and-Program-Policies/English-Composition")
//     const resParser = HTMLParser.parse(res.data);
// const category_name = resParser.querySelectorAll("h1.degreeTitle").map(x => x.text.replace(/[\r\t\n]/g, ''))
//       const subcategories = resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1").map(x => x.text.replace(/[\r\t\n]/g, ''))
//       const course_codes = resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1 a.sc-courselink").map(x => x.text).length != 0 ? resParser.querySelectorAll("a.sc-courselink").map(x => x.text) : resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1 ~ p.sc-RequirementsSubheading, h3.sc-RequiredCoursesHeading1 ~ span").map(x => x.querySelectorAll("a").map(x => x.text)).filter(x => x.length != 0)
     // const course_codes = resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1 ~ p.sc-RequirementsSubheading, h3.sc-RequiredCoursesHeading1 ~ span").map(x => x.querySelectorAll("a").map(x => x.text)).filter(x => x.length != 0)
      // const req = subcategories.map((x, index) => ({ subcategory: x, course_code: course_codes[index] }))
      // const categories = category_name.map((x, index) => ({ category: x, req: req }))

    for (const x of href) {
      const res = await axios.get("https://molloy.smartcatalogiq.com" + x)
      const resParser = HTMLParser.parse(res.data);
      const category_name = resParser.querySelectorAll("h1.degreeTitle").map(x => x.text.replace(/[\r\t\n]/g, ''))
      const subcategories = resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1").map(x => x.text.replace(/[\r\t\n]/g, ''))
     const course_codes = resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1 a.sc-courselink").map(x => x.text).length != 0 ? resParser.querySelectorAll("a.sc-courselink").map(x => x.text) : resParser.querySelectorAll("h3.sc-RequiredCoursesHeading1 ~ p.sc-RequirementsSubheading, h3.sc-RequiredCoursesHeading1 ~ span").map(x => x.querySelectorAll("a").map(x => x.text)).filter(x => x.length != 0)
      const req = subcategories.map((x, index) => ({ subcategory: x, course_code: course_codes[index] }))
      const categories = category_name.map((x, index) => ({ category: x, req: req }))

    allResults.push(...categories)
      
    }

    return allResults
  }
  catch (error) {
    console.error(error);
  }
}
getGenEd().then((result) => fs.writeFileSync("gen-ed.json", JSON.stringify(result)));
// getGenEd().then((result) => console.log(result));

