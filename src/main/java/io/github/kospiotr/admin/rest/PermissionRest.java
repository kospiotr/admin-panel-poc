package io.github.kospiotr.admin.rest;

import io.github.kospiotr.admin.model.Permission;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static java.util.Arrays.asList;

@RestController
@RequestMapping("/rest/permission")
public class PermissionRest {
    public static final Permission READ_PERMISSION = new Permission(1, "Read");
    public static final Permission WRITE_PERMISSION = new Permission(2, "Write");
    public static final Permission UPDATE_PERMISSION = new Permission(3, "Update");
    public static final Permission DELETE_PERMISSION = new Permission(4, "Delete");


    @RequestMapping("/all")
    public List<Permission> all() {
        return asList(
                READ_PERMISSION,
                WRITE_PERMISSION,
                UPDATE_PERMISSION,
                DELETE_PERMISSION
        );
    }

}
