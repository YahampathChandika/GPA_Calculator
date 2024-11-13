// App.js
import React, { useState } from "react";

function App() {
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [gpaBreakdown, setGpaBreakdown] = useState([]);

  const gradePoints = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
  };

  const yearWeights = {
    1: 0.1,
    2: 0.2,
    3: 0.3,
    4: 0.4,
  };

  const handleAddCourse = (year) => {
    setCourses([
      ...courses,
      { year, grade: "", credits: 0, id: courses.length },
    ]);
  };

  const handleChange = (id, field, value) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const calculateWeightedGPA = () => {
    let weightedGPA = 0;
    let breakdown = [];

    for (const year in yearWeights) {
      let totalPoints = 0;
      let totalCredits = 0;

      const yearCourses = courses.filter(
        (course) => course.year === parseInt(year)
      );

      for (const course of yearCourses) {
        const { grade, credits } = course;
        if (!gradePoints[grade]) continue;

        totalPoints += gradePoints[grade] * parseFloat(credits);
        totalCredits += parseFloat(credits);
      }

      const yearGPA = totalCredits ? totalPoints / totalCredits : 0;
      const weightedYearGPA = yearGPA * yearWeights[year];
      weightedGPA += weightedYearGPA;
      breakdown.push({
        year,
        yearGPA: yearGPA.toFixed(2),
        weightedYearGPA: weightedYearGPA.toFixed(2),
        weight: yearWeights[year],
      });
    }

    setGpa(weightedGPA.toFixed(2));
    setGpaBreakdown(breakdown);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">GPA Calculator</h1>

      {/* GPA Calculation Section */}
      <div className="w-full flex flex-col md:flex-row gap-16">
        {/* Grade Points Table */}
        <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mb-10">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">
            Grade Points Table
          </h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b p-2 w-1/2 text-center">Grade</th>
                <th className="border-b p-2 w-1/2 text-center">Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(gradePoints).map(([grade, point]) => (
                <tr key={grade}>
                  <td className="border-t p-2 w-1/2 text-center">{grade}</td>
                  <td className="border-t p-2 w-1/2 text-center">{point.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {[1, 2, 3, 4].map((year) => (
          <div
            key={year}
            className="w-full max-w-md mb-6 bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex justify-between px-5 py-2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Year {year}
              </h2>
              <button
                onClick={() => handleAddCourse(year)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Course
              </button>
            </div>

            <div>
              {courses
                .filter((course) => course.year === year)
                .map((course) => (
                  <div
                    key={course.id}
                    className="flex gap-2 items-start sm:items-center mb-4"
                  >
                    <select
                      value={course.grade}
                      onChange={(e) =>
                        handleChange(course.id, "grade", e.target.value)
                      }
                      className="mr-0 sm:mr-4 mb-2 sm:mb-0 p-2 border text-sm md:text-base border-gray-300 rounded !w-1/2 sm:w-auto"
                    >
                      <option value="">Select Grade</option>
                      {Object.keys(gradePoints).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Credits"
                      value={course.credits}
                      onChange={(e) =>
                        handleChange(course.id, "credits", e.target.value)
                      }
                      className="p-2 border border-gray-300 rounded !w-1/2 sm:w-auto"
                    />
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculateWeightedGPA}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
      >
        Calculate GPA
      </button>

      {/* GPA Result Section */}
      {gpa !== null && (
        <div className="mt-6 w-full max-w-md bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800">
            Weighted GPA: {gpa}
          </h2>
          <h3 className="text-xl font-semibold text-gray-700 mt-4">
            GPA Breakdown
          </h3>
          {gpaBreakdown.map((item) => (
            <div
              key={item.year}
              className="mt-2 p-2 border border-gray-200 rounded"
            >
              <p>
                <strong>Year {item.year}:</strong>
              </p>
              <p>Year GPA: {item.yearGPA}</p>
              <p>
                Weighted GPA for Year: {item.weightedYearGPA} (Weight:{" "}
                {item.weight * 100}%)
              </p>
            </div>
          ))}
          <p className="mt-4 text-sm text-gray-600">
            * The weighted GPA is calculated by taking each year's GPA,
            multiplying it by the assigned weight (10% for 1st year, 20% for 2nd
            year, 30% for 3rd year, 40% for 4th year), and then summing them
            together.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
