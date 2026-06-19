import validator from "validator";
// import CryptoJS from 'crypto-js';
export const trimPhoneNumber = (phone:string) => {
  return phone?.substring(1);
};

export const checkForEmptyValuesInArrayOfObjects = (arr:[Object]) => {
  let emptyValuesArr = arr.map((data) => {
    let checkIfSomePackagesDataAreEmpty = Object.values(data).some(
      (data) => data == ""
    );

    console.log(
      "checkIfSomePackagesDataAreEmpty>>",
      checkIfSomePackagesDataAreEmpty
    );

    return checkIfSomePackagesDataAreEmpty;
  });

  if (emptyValuesArr.includes(true)) {
    return true;
  }

  return false;
};


export const areAllValuesInObjectEmptyExceptId = (obj:any) => {
  return Object.entries(obj).every(([key, value]) => 
    key === "id" || key==="isEnabled" || value === "" || value === null || value === undefined
);
};


export const groupByUtility = (data:any, key:any) => {
  return data.reduce((acc:any, item:any) => {
    const groupKey = item[key];

    if (!acc[groupKey]) {
      acc[groupKey] = {
        title: groupKey,
        categoryId:item.categoryId,
        items: [],
      };
    }

    acc[groupKey].items.push(item);

    return acc;
  }, {});

  // return data.reduce((acc, item) => {
  //   const groupKey = item[key];
  //   if (!acc[groupKey]) acc[groupKey] = [];
  //   acc[groupKey].push(item);
  //   return acc;
  // }, {});
};


export const groupByCategoryIdUtility = (data:any, key:any) => {
  return data.reduce((acc:any, item:any) => {
    const groupKey = item[key];

    if (!acc[groupKey]) {
      acc[groupKey] = {
        title: item.permissionCategoryId,
        categoryId:item.permissionCategoryId,
        items: [],
      };
    }

    acc[groupKey].items.push(item);

    return acc;
  }, {});

  // return data.reduce((acc, item) => {
  //   const groupKey = item[key];
  //   if (!acc[groupKey]) acc[groupKey] = [];
  //   acc[groupKey].push(item);
  //   return acc;
  // }, {});
};



export function toQueryParams(filters:any) {
  const params = new URLSearchParams();

  filters.forEach(filter => {
    if (filter.label && filter.value) {
      params.append(filter.label, filter.value);
    }
  });

  return params.toString(); // Returns a query string
}


export function validateFilters(filters:any) {
  // Check if startDate is missing and endDate is present
  const hasStartDate = filters.some(filter => filter.label === "startDate");
  const hasEndDate = filters.some(filter => filter.label === "endDate");

  if (!hasStartDate && hasEndDate) {
   return true
  }
}


export function validateFiltersStartAndEndDate(filters  :any) {
  // Check if startDate is missing and endDate is present
  const hasStartDate = filters.some(filter => filter.label === "startDate");
  const hasEndDate = filters.some(filter => filter.label === "endDate");

  if (!hasStartDate && hasEndDate) {
   return true
  }
}

export function validateMaxMinFilters(filters:any) {
  // Check if startDate is missing and endDate is present
  const hasMinDate = filters.some(filter => filter.label === "minAmount");
  const hasMaxDate = filters.some(filter => filter.label === "maxAmount");

  if (!hasMinDate && hasMaxDate) {
   return true
  }
}

export function validateCompanyAndDepartmentFilters(filters:any) {
  // Check if startDate is missing and endDate is present
  const hasCompany = filters.some(filter => filter.label === "company");
  const hasDepartment = filters.some(filter => filter.label === "department");

  if (hasCompany && !hasDepartment) {
   return true
  }
}




export const sendToServiceWorker = (url:any, payload:any) => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "API_CALL",
      url,
      payload,
    })
  } else {
    console.error("No active service worker found.");
  }
};

export const receiveDataFromServiceWorker = (url:any, payload:any) => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "API_CALL_RECEIVED",
      url,
      payload,
    })
  } else {
    console.error("No active service worker found.");
  }
};

   export const isUUID = (id:any) => validator.isUUID(id);

   export  function  areObjectsEqual(obj1:any, obj2:any) {
  
    // If both are the same reference, return true
    if (obj1 === obj2) return true;

    // If either is not an object or is null, return false
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    // Get keys from both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Check if number of keys is different
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Check if all keys and values are the same
    for (let key of keys1) {
        if (!keys2.includes(key)) return false; // Check if key exists in obj2

        const value1 = obj1[key];
        const value2 = obj2[key];

        // If values are objects, recursively check equality
        if (typeof value1 === "object" && typeof value2 === "object") {
            if (!areObjectsEqual(value1, value2)) {
                return false;
            }
        } else if (value1 !== value2) {
            return false;
        }
    }

    return true;
}


export const regrexForSpecialChars=(input:any)=>{
  // const newValue = input:any.replace(/[^a-zA-Z0-9 ]/g, ""); // Allows only letters and numbers
const newValue = input
  .replace(/[^a-zA-Z0-9 (),-]/g, "")
  .replace(/ {2,}/g, " ");
  //const newValue = input:any.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, "");

  return newValue
}

export const regrexForSpecialDashChars = (input:any) => {
  const newValue = input
    .replace(/[^a-zA-Z0-9 -]/g, "")   // ← added -
    .replace(/ {2,}/g, "");           // keeps your existing logic

  return newValue;
};

export const validateRequiredText = (
  value: string,
  fieldLabel: string,
) => {
  return value.trim() ? "" : `${fieldLabel} is required.`;
};

export const validateMinimumTextLength = (
  value: string,
  fieldLabel: string,
  minLength: number,
) => {
  return value.trim().length >= minLength
    ? ""
    : `${fieldLabel} must be at least ${minLength} characters.`;
};

export const validateRoleNameText = (value: string) => {
  const trimmedValue = value.trim();
  const requiredError = validateRequiredText(trimmedValue, "Role name");

  if (requiredError) {
    return requiredError;
  }

  const minimumLengthError = validateMinimumTextLength(
    trimmedValue,
    "Role name",
    3,
  );

  if (minimumLengthError) {
    return minimumLengthError;
  }

  if (!/^[A-Za-z0-9\s&'/-]+$/.test(trimmedValue)) {
    return "Use only letters, numbers, spaces, &, apostrophes, slashes, or hyphens.";
  }

  return "";
};

export const regexForSpecialCharsSupportDecimals = (input:any) => {
  const newValue = input
    .replace(/[^a-zA-Z0-9. ]/g, "") // Allow letters, numbers, spaces, and dots
    .replace(/ {2,}/g, " ") // Prevent multiple consecutive spaces
    .replace(/(\..*)\./g, "$1"); // Prevent multiple dots
  
  return newValue;
};

// export const groupDataByMonth = (data: {
//   taskStatistics: number[];
//   incidentStatistics: number[];
//   timePeriods: string[];
// }) => {
//   const monthMap: { [key: string]: { taskSum: number; incidentSum: number } } =
//     {};

//   data.timePeriods.forEach((date, index) => {
//     const month = date.substring(0, 7); // Extract YYYY-MM

//     if (!monthMap[month]) {
//       monthMap[month] = { taskSum: 0, incidentSum: 0 };
//     }

//     monthMap[month].taskSum += data.taskStatistics[index] || 0;
//     monthMap[month].incidentSum += data.incidentStatistics[index] || 0;
//   });

//   return {
//     timePeriods: Object.keys(monthMap),
//     taskStatistics: Object.values(monthMap).map((d) => d.taskSum),
//     incidentStatistics: Object.values(monthMap).map((d) => d.incidentSum),
//   };
// };


export const groupDataByMonth = (data: {
  closedIncidents: number[],
  closedTasks:number[],
  completedIncidentsStatistics: number[],
  completedTasksStatistics:number[],
  openIncidents:number[],
  openTasks:number[],
  pendingIncidents:number[],
  pendingTasks:number[],
  timePeriods: string[];
}) => {
  const monthMap: { [key: string]: { 
    closedIncidentsSum: number; 
    closedTasksSum: number ;
    completedIncidentsStatisticsSum:number;
    completedTasksStatisticsSum:number;
    openIncidentsSum:number;
    openTasksSum:number;
    pendingIncidentsSum:number;
    pendingTasksSum:number;
  } } =
    {};

  data.timePeriods.forEach((date, index) => {
    const month = date.substring(0, 7); // Extract YYYY-MM

    if (!monthMap[month]) {
      monthMap[month] = { 

        closedIncidentsSum: 0,
        closedTasksSum: 0,
        completedIncidentsStatisticsSum:0,
        completedTasksStatisticsSum:0,
        openIncidentsSum:0,
        openTasksSum:0,
        pendingIncidentsSum:0,
        pendingTasksSum:0
       };
    }

    monthMap[month].closedIncidentsSum += data.closedIncidents[index] || 0;
    monthMap[month].closedTasksSum += data.closedTasks[index] || 0;
    monthMap[month].completedIncidentsStatisticsSum += data.completedIncidentsStatistics[index] || 0;
    monthMap[month].completedTasksStatisticsSum += data.completedTasksStatistics[index] || 0;
    monthMap[month].openIncidentsSum += data.openIncidents[index] || 0;
    monthMap[month].openTasksSum += data.openTasks[index] || 0;
    monthMap[month].pendingIncidentsSum += data.pendingIncidents[index] || 0;
    monthMap[month].pendingTasksSum += data.pendingTasks[index] || 0;
  });

  return {
    timePeriods: Object.keys(monthMap),
    closedIncidents: Object.values(monthMap).map((d) => d.closedIncidentsSum),
    closedTasks: Object.values(monthMap).map((d) => d.closedTasksSum),
    completedIncidentsStatistics: Object.values(monthMap).map((d) => d.completedIncidentsStatisticsSum),
    completedTasksStatistics: Object.values(monthMap).map((d) => d.completedTasksStatisticsSum),
    openIncidents: Object.values(monthMap).map((d) => d.openIncidentsSum),
    openTasks: Object.values(monthMap).map((d) => d.openTasksSum),
    pendingIncidents: Object.values(monthMap).map((d) => d.pendingIncidentsSum),
    pendingTasks: Object.values(monthMap).map((d) => d.pendingTasksSum),

   
  };
};



// export function getDecimalRegex(maxDecimals) {
//   return new RegExp(`^(?!\\.)[0-9]+(\\.[0-9]{1,${maxDecimals}})?$`);
// }

export function getDecimalRegex(maxDecimals:any) {
  return new RegExp(`^(?!\\.)\\d*(\\.\\d{0,${maxDecimals}})?$`);
}

export function getIntegerRegex(maxDecimals:any) {
  return new RegExp(`/^(?!\\.)[0-9]{1,n}(\\.[0-9]{1,${maxDecimals}})?$/`);
}

