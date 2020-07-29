/**
 * param {string} table 
 * param {Array [column,...]} items 
 * param {string name of JSON object} objName 
 * param {string} search 
 * param {float} min_salary 
 * param {Numeric value less than 1.0} min_equity 
 */
function sqlGetWhere({search, min_salary, min_equity}) {
  const items = ["title", "salary", "equity", "company_handle"];
  // build columns string
  let cols = "";
  for(let i = 0; i < items.length; i++) {
    cols += i ? `,'${items[i]}', ${items[i]}` : `'${items[i]}', ${items[i]}`
  }
  // build first part of SELECT statement
  let query = `SELECT json_build_object(${cols}) job FROM jobs `
  let idx = 1;
  let values = [];
  // build WHERE clause
  let whereClause = "WHERE ";
  if(search.length) {
    // search: If the query string parameter is passed, a filtered list of titles and company handles should be displayed based on the search term and if the job title includes it.
    whereClause += `(title ILIKE $${idx} OR company_handle ILIKE $${idx++})`;
    // whereClause += `(name ILIKE $${idx} OR handle ILIKE $${idx++})`;
    values.push(`%${search}%`);
  }
  if(min_salary && min_equity) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` salary > $${idx++} AND equity > $${idx++}`;
    values.push(min_salary);
    values.push(min_equity);
  }
  else if(min_salary) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` salary > $${idx++}`;
    values.push(min_salary);
  }
  else if(min_equity) {
    if(whereClause.length > 6) whereClause += " AND ";
    whereClause += ` equity > $${idx++}`;
    values.push(min_equity);
  }
  if(whereClause.length > 6) {
    query += `${whereClause}`;
  }
  return { query, values };
}

module.exports = sqlGetWhere;