function shouldBeReplaced1()
{
    console.log('hello, world!');
}

function shouldBeReplaced2() {
    console.log('hello, world!');
}

var object = {

    shouldBeReplaced3: function() {
        console.log('sup world');
    },

    shouldBeReplaced4: function()
    {
        console.log('sup world');
    }
}

function shouldBeReplaced5(arg)
{
    console.log('hello, world!');
}

function shouldBeReplaced6(arg1, arg2) {
    console.log('hello, world!');
}

function shouldBeReplaced7($arg1, arg2) {
    console.log('hello, world!');
}

function shouldBeReplaced8(
    arg1,
    arg2
) {
    console.log('hello, world!');
}

shouldBeReplaced1();
shouldBeReplaced2();

object.shouldBeReplaced3();
object.shouldBeReplaced4();

shouldBeReplaced5('hello');
shouldBeReplaced6('hello', 'world');
shouldBeReplaced7('hello', 8);

var myVar = 10;
shouldBeReplaced8(myVar, 9);