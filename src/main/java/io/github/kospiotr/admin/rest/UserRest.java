package io.github.kospiotr.admin.rest;

import io.github.kospiotr.admin.model.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.NoSuchElementException;

import static io.github.kospiotr.admin.rest.PermissionRest.*;
import static java.util.Arrays.asList;

@RestController
@RequestMapping("/rest/user")
public class UserRest {

    private static final User JOHN_USER = new User(1, "John", asList(READ_PERMISSION, WRITE_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION));
    private static final User MARY_USER = new User(2, "Mary", asList(READ_PERMISSION, WRITE_PERMISSION));
    private static final User DAVE_USER = new User(3, "Dave", asList(READ_PERMISSION, DELETE_PERMISSION));

    @RequestMapping("/current")
    public User getCurrent() {
        return JOHN_USER;
    }

    @RequestMapping("/all")
    public List<User> getAll() {
        return asList(JOHN_USER, MARY_USER, DAVE_USER);
    }

    @RequestMapping("/{id}")
    public User getId(@PathVariable Integer id) {
        return getAll().stream().filter(u -> u.getId().equals(id)).findFirst().
                orElseThrow(NoSuchElementException::new);
    }

}
