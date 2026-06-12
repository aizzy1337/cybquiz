package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.GroupDto;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.List;
import java.util.function.Supplier;

@Component("getAllGroups")
@RequiredArgsConstructor
public class GetAllGroupsFunction implements Supplier<List<GroupDto>> {

    private final GroupService service;

    @Override
    public List<GroupDto> get() {
        return service.findAll();
    }
}