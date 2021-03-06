
function sqlForGetCompanies({search, min_employees, max_employees}) {
  
  let idx = 1;
  let values = [];
  // let query2 = `SELECT json_build_object(
  //               'handle', handle, 
  //               'name', name, 
  //               'num_employees', num_employees, 
  //               'description', description,
  //               'logo_url', logo_url
  //             ) ''
  //             FROM companies`;
  let query = `SELECT handle, name, num_employees, description, logo_url
              FROM companies`;

  let whereClause = "WHERE ";
  if(search.length) {
    whereClause += `(name ILIKE $${idx} OR handle ILIKE $${idx++})`;
    values.push(`%${search}%`);
  }
  if(min_employees && max_employees) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` num_employees > $${idx++} AND num_employees < $${idx++}`;
    values.push(min_employees);
    values.push(max_employees);
  }
  else if(min_employees) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` num_employees > $${idx++}`;
    values.push(min_employees);
  }
  else if(max_employees) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` num_employees < $${idx++}`;
    values.push(max_employees);
  }
  if(whereClause.length > 6) {
    query += ` ${whereClause}`;
  }
  return { query, values };
}

module.exports = sqlForGetCompanies;