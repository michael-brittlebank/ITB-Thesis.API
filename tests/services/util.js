const chai = require('chai'),
    assert = chai.assert,
    should = chai.should(),
//services
    utilService = require('../../services/util');

describe('Tests for UtilService', function() {
    describe('the isValueNotNull function', function() {
        it('should detect undefined keys', function() {
            utilService.isValueNotNull({},'key').should.equal(false);
        });
        it('should detect null objects', function() {
            utilService.isValueNotNull(null,'key').should.equal(false);
        });
        it('should detect undefined objects', function() {
            utilService.isValueNotNull(undefined,'key').should.equal(false);
        });
        it('should detect non objects', function() {
            utilService.isValueNotNull('object','key').should.equal(false);
        });
    });

    describe('the getValueByKey function', function() {
        it('should return empty string on failure', function() {
            utilService.getValueByKey({},'key').should.equal('');
        });
        it('should return key on success', function() {
            utilService.getValueByKey({key:'value'},'key').should.equal('value');
        });
    });

    describe('the getFirstValueByKey function', function() {
        it('should return empty string on failure', function() {
            utilService.getFirstValueByKey({},'key').should.equal('');
        });
        it('should return first element of value array', function() {
            utilService.getFirstValueByKey({key:['value1','value2']},'key').should.equal('value1');
        });
    });
});