package io.github.kospiotr.admin.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest")
public class HelloRest {

    @RequestMapping("/hello")
    public String hello(){
        return "Hello";
    }

}
