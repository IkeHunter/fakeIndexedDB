require("../../build/global.js");
const {
    add_completion_callback,
    assert_array_equals,
    assert_equals,
    assert_false,
    assert_not_equals,
    assert_throws,
    assert_true,
    async_test,
    createdb,
    createdb_for_multiple_tests,
    fail,
    indexeddb_test,
    setup,
    test,
} = require("../support-node.js");

const document = {};
const window = global;


    var db, index,
      t = async_test(),
      record = { key: 1, indexedProperty: "data" };

    var open_rq = createdb(t);
    open_rq.onupgradeneeded = function(e) {
        db = e.target.result;
        var objStore = db.createObjectStore("store", { keyPath: "key" });
        index = objStore.createIndex("index", "indexedProperty");

        objStore.add(record);
    }

    open_rq.onsuccess = function(e) {
        var rq = db.transaction("store")
                   .objectStore("store")
                   .index("index")
                   .get(record.indexedProperty);

        rq.onsuccess = t.step_func(function(e) {
            assert_equals(e.target.result.key, record.key);
            t.done();
        });
    }
