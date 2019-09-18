Получение данных по пользователю в шаблоне:
<%=curUser.lastname%> - Фамилия
<%=curUser.firstname%> - Имя
<%=curUser.middlename%> - Отчество
<%=curUser.position_parent_name%> - Подразделение
<%=curUser.position_name%> - Должность
<%=curUser.hire_date%> - Дата приема
<%=curUser.sex%> - Пол
<%=curUser.birth_date%> - Дата рождения
<% for ( elem in curUser.path_subs) {%>
	<%=elem.name%> 
<%}%> - Получить штатное расписание сотрудника
<%=curUserID%> - ID сотрудника

Функция для общения с сервером, добавить к себе в шаблон. Отдаёт или записывает данные по ключу 'flag' со значениями get и send, также требует person_id(ID сотрудника)
function get_send_data(DT, func) {
	var XHR = new XMLHttpRequest();
	//Открываем соединение
	XHR.open("POST", 'remote_action.html?action=6737268026748272006', true);
	//Устанавливаем тип ответа
	XHR.responseType = 'text';
	//Устанавливаем заголовок
	XHR.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
	//Обработчик успешного выполнения скриптаJSON
	XHR.onload = function () {
		if (XHR.readyState == 4 && XHR.status == 200) func(XHR.response != '' ? JSON.parse(XHR.response) : {});
	}
	//Задаём время для автоматического прекращения работы(10sec)
	XHR.timeout = 10000;
	//Выводим сообщение на ошибку или таймаут или прерывание загрузки скрипта
	XHR.onerror = XHR.ontimeout = XHR.onabort = function () {
		alert('Извините, во время выполнения возникла ошибка, попробуйте позже или сообщите администратору, текст ошибки:' + XHR.responseText);
	}
	//Отправляем данные формы через API на скрипт
	XHR.send(DT);
}

Примеры работы с функцией:
//Запишет для данного пользователя в БД {"bonus_code" : "8439","epp_bonus" : "322"} и вернёт json: {status: "recorded"}
get_send_data('flag=send&person_id=6657115464064443522&bonus_code=8439&epp_bonus=322', function(data) {console.log(data);});

//Запросит в БД данные по пользователю с id=6657115464064443522 и вернёт json: {bonus_code: "8439", epp_bonus: "322"}
get_send_data('flag=get&person_id=6657115464064443522', function(data) {console.log(data);});

//Если отправить некорректный запрос, то функция вернёт ошибку, прим. json: {error: "Элемент не найден (GetProperty(),  Unknown source,   line 4)"}
get_send_data('person_id=6657115464064443522', function(data) {console.log(data);});

Ниже представляю серверный код, исключительно для ознакомления.
try {
    //Initialize person_id and flag from query
    person_id = CONTEXT.GetProperty("person_id");
    flag = CONTEXT.GetProperty("flag");

    if (flag == 'send') {

        //Initialize data to record in db
        var obj = new Object();
        for (data in CONTEXT) {
            if (data != 'person_id' && data != 'flag' && data != 'action') obj.SetProperty(data,CONTEXT.GetOptProperty(data,'undefined'));
        }
        data = tools.object_to_text(obj,'json');

        //Record or rewrite data to user
        sql = "sql: update Epp_users_datas set data="+SqlLiteral(data)+" where person_id="+SqlLiteral(person_id)+" IF @@ROWCOUNT=0 insert into Epp_users_datas(person_id,data) values("+SqlLiteral(person_id)+","+SqlLiteral(data)+")";
        for (elem in XQuery(sql)) break; 
        result = tools.object_to_text({'status' : 'recorded'},'json');

    } else if (flag == 'get') {

        //Get data from user
        sql = "sql: select JSON_QUERY(data) as data from Epp_users_datas where person_id="+SqlLiteral(person_id);
        get_data = ArrayOptFirstElem(XQuery(sql));
        result = get_data.data;
    }
} catch(e){
    //Get error if script crash
    result = tools.object_to_text({'error' : ExtractUserError(e)},'json');
}

//Send results
Response.Write(result);