<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>EJS 화면</h1>
    
     <%=data.name%><p/>
     <%=data.title%><p/>
     <%=data.content%><p/>
     <script type="text/javascript">
        var newData = <%- JSON.stringify(data) %>
        console.log(newData)
        console.log('로그를 출력합니다.')
     </script>
</body>
</html>
