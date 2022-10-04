module.exports = {
    bang_List: `select * from bang order by location`,
    bang_Insert: `insert into bang set ?`,
    bang_truncate: `truncate table bang`,
    bang_chart :`select SUBSTRING_INDEX(rent,'/',-1) as 월세,area as 평수_층,SUBSTRING_INDEX(area,'m',1) as 크기,location as 지역 from bang where not rent like '전세%' order by 지역`,
    userdata_insert : `insert into userdata set ?`,
    userdata_list : `SELECT * FROM userdata WHERE id=?` 
}