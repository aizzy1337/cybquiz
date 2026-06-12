package wsb.edu.cybquiz.group.function;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import wsb.edu.cybquiz.group.dto.GroupCreateResponseDto;
import wsb.edu.cybquiz.group.dto.GroupDto;
import wsb.edu.cybquiz.group.service.GroupService;

import java.util.function.Function;

@Component("createGroup")
@RequiredArgsConstructor
public class CreateGroupFunction implements Function<GroupDto, GroupCreateResponseDto> {

    private final GroupService service;

    @Override
    public GroupCreateResponseDto apply(GroupDto dto) {
        return service.create(dto);
    }
}