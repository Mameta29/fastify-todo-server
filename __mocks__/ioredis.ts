class RedisMock {
    hset = jest.fn();
    hgetall = jest.fn();
    del = jest.fn();
    expire = jest.fn();
    quit = jest.fn();
  }
  
  export default RedisMock;
  