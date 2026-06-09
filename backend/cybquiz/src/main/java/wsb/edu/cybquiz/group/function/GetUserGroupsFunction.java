package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.GroupDto;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.List;
import java.util.function.Function;

@Component("getUserGroups")
@RequiredArgsConstructor
public class GetUserGroupsFunction implements Function<String, List<GroupDto>> {

    private final GroupService service;

    @Override
    public List<GroupDto> apply(String userId) {
        return service.findByUser(userId);
    }
}
