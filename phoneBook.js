'use strict';

var phoneBook = [];

//Функция добавления записи в телефонную книгу
module.exports.add = function add(name, phone, email) {
    if (!name || !phone || !email) {
        return false;
    }
    if (typeof name === 'string' && isValidPhone(phone) && isValidEmail(email)) {
        phoneBook.push({name: name, phone: phone.replace(/\D/g, ''), email: email});
        return true;
    }
};

//Функция поиска записи в телефонной книге
module.exports.find = function find(query) {
    var foundEntries = findEntries(query);
    var entriesLength = foundEntries.length;
    for (var i = 0; i < entriesLength; i++) {
        console.log(foundEntries[i].name + ', ' + foundEntries[i].phone + ', ' +
            foundEntries[i].email);
    }
};

//Функция поиска записи в телефонной книге
function findEntries(query) {
    if (!query) {
        query = '';
    }
    var foundEntries = [];
    var phoneBookLength = phoneBook.length;
    for (var i = 0; i < phoneBookLength; i++) {
        var name = phoneBook[i].name;
        var phone = phoneBook[i].phone;
        var email = phoneBook[i].email;
        if (name.indexOf(query) !== -1 || phone.indexOf(query) !== -1 ||
            email.indexOf(query) !== -1) {
            foundEntries.push(phoneBook[i]);
        }
    }
    return foundEntries;
}

//Функция удаления записи в телефонной книге
module.exports.remove = function remove(query) {
    if (!query) {
        query = '';
    }
    var toDelete = findEntries(query);
    var deleteListLength = toDelete.length;
    for (var i = 0; i < deleteListLength; i++) {
        phoneBook.splice(phoneBook.indexOf(toDelete[i]), 1);
    }
    console.log('Удалено контактов: ' + deleteListLength);
};

//Функция импорта записей из файла (задача со звёздочкой!).
module.exports.importFromCsv = function importFromCsv(filename) {
    var data = require('fs').readFileSync(filename, 'utf-8').split(/[\r\n]/g);
    var addedContacts = 0;
    for (var i = 0; i < data.length; i++) {
        var args = data[i].split(';');
        if ((args.length === 3) && module.exports.add(args[0], args[1], args[2])) {
            addedContacts += 1;
        }
    }
    console.log('Добавлено контактов: ' + addedContacts);
};

//Функция вывода всех телефонов в виде ASCII (задача со звёздочкой!).
module.exports.showTable = function showTable() {

    var phoneBookLength = phoneBook.length;
    var maxNameLength = 0;
    var maxPhoneLength = 0;
    var maxEmailLength = 0;
    for (var i = 0; i < phoneBookLength; i++) {
        var nameLength = phoneBook[i].name.length;
        var phoneLength = phoneBook[i].phone.length;
        var emailLength = phoneBook[i].email.length;
        if (nameLength > maxNameLength) {
            maxNameLength = nameLength;
        }
        if (phoneLength > maxPhoneLength) {
            maxPhoneLength = phoneLength;
        }
        if (emailLength > maxEmailLength) {
            maxEmailLength = emailLength;
        }
    }
    var PADDING = 4;
    maxNameLength += PADDING;
    maxPhoneLength += PADDING;
    maxEmailLength += PADDING;

    function repeatString(string, multiplier) {
        return new Array(multiplier + 1).join(string);
    }

    function frameWithSpaces(string, length) {
        var spaces = length - string.length;
        var resultString = '';
        if (spaces % 2 === 0) {
            var multiplier = spaces / 2;
            var spacesStr = repeatString(' ', multiplier);
            resultString = spacesStr + string + spacesStr;
        } else {
            var multiplierRight = (spaces / 2).toFixed() - 1;
            var multiplierLeft = multiplierRight + 1;
            resultString = repeatString(' ', multiplierLeft) + string +
                repeatString(' ', multiplierRight);
        }
        return resultString;
    }

    console.log('┌' + repeatString('─', maxNameLength) + '┬' +
        repeatString('─', maxPhoneLength) + '┬' +
        repeatString('─', maxEmailLength) + '┐');

    console.log('│' + frameWithSpaces('Имя', maxNameLength) + '│' +
        frameWithSpaces('Телефон', maxPhoneLength) + '│' +
        frameWithSpaces('email', maxEmailLength) + '│');

    console.log('│' + repeatString('─', maxNameLength) + '┼' +
        repeatString('─', maxPhoneLength) + '┼' +
        repeatString('─', maxEmailLength) + '│');

    for (var j = 0; j < phoneBookLength; j++) {
        console.log('│' + frameWithSpaces(phoneBook[j].name, maxNameLength) + '│' +
            frameWithSpaces(phoneBook[j].phone, maxPhoneLength) + '│' +
            frameWithSpaces(phoneBook[j].email, maxEmailLength) + '│');
    }

    console.log('└' + repeatString('─', maxNameLength) + '┴' +
        repeatString('─', maxPhoneLength) + '┴' +
        repeatString('─', maxEmailLength) + '┘');

};

function isValidPhone(phone) {
    if (typeof phone === 'string') {
        var phoneRegexp = /^\+?\d{1,3}\s?((\(\d{1,3}\))|\d{1,3})\s?\d{3}\s?\-?\s?\d\s?\-?\s?\d{3}$/i;
        return phoneRegexp.test(phone);
    }
    return false;
}

function isValidEmail(email) {
    if (typeof email === 'string') {
        var mailRegexp = /^[^@]+@[^@]+\.[^@]+$/i;
        return mailRegexp.test(email);
    }
    return false;
}
