#!/bin/bash

# 三层架构CRUD测试执行脚本
# 文件名: run_crud_tests.sh
# 功能: 自动编译并执行DAL、控制器、API三层的CRUD测试
# 使用方法: ./run_crud_tests.sh [layer]
# 参数说明:
#   - 无参数: 运行综合测试
#   - dal: 仅运行DAL层测试
#   - controller: 仅运行控制器层测试
#   - api: 仅运行API层测试
#   - all: 运行综合测试（同无参数）

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_SCRIPT_DIR="$PROJECT_ROOT/testAll/testScript"
TEST_DATA_DIR="$PROJECT_ROOT/testAll/testData"
TEST_REPORT_DIR="$PROJECT_ROOT/testAll/testReport"

# 打印带颜色的消息
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 打印标题
print_title() {
    echo
    echo "==========================================="
    print_message $BLUE "$1"
    echo "==========================================="
}

# 检查Node.js和npm
check_prerequisites() {
    print_title "检查环境依赖"
    
    if ! command -v node &> /dev/null; then
        print_message $RED "❌ Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_message $RED "❌ npm 未安装，请先安装 npm"
        exit 1
    fi
    
    if ! command -v npx &> /dev/null; then
        print_message $RED "❌ npx 未安装，请先安装 npx"
        exit 1
    fi
    
    print_message $GREEN "✅ Node.js: $(node --version)"
    print_message $GREEN "✅ npm: $(npm --version)"
    print_message $GREEN "✅ npx: $(npx --version)"
}

# 检查TypeScript编译器
check_typescript() {
    if ! command -v tsc &> /dev/null; then
        print_message $YELLOW "⚠️ TypeScript编译器未全局安装，尝试使用npx..."
        if ! npx tsc --version &> /dev/null; then
            print_message $RED "❌ TypeScript编译器不可用，请安装: npm install -g typescript"
            exit 1
        fi
        TSC_CMD="npx tsc"
    else
        TSC_CMD="tsc"
        print_message $GREEN "✅ TypeScript: $(tsc --version)"
    fi
}

# 创建必要的目录
setup_directories() {
    print_title "设置测试环境"
    
    mkdir -p "$TEST_REPORT_DIR"
    print_message $GREEN "✅ 测试报告目录已准备: $TEST_REPORT_DIR"
    
    # 检查测试文件是否存在
    local test_files=(
        "$TEST_SCRIPT_DIR/dal_crud_testAll.ts"
        "$TEST_SCRIPT_DIR/controller_crud_testAll.ts"
        "$TEST_SCRIPT_DIR/api_crud_testAll.ts"
        "$TEST_SCRIPT_DIR/run_all_crud_tests.ts"
    )
    
    for file in "${test_files[@]}"; do
        if [[ ! -f "$file" ]]; then
            print_message $RED "❌ 测试文件不存在: $file"
            exit 1
        fi
    done
    
    print_message $GREEN "✅ 所有测试文件已确认存在"
}

# 编译TypeScript文件
compile_typescript() {
    local file=$1
    local name=$2
    
    print_message $BLUE "🔧 正在编译 $name..."
    
    if $TSC_CMD "$file" --outDir "$TEST_SCRIPT_DIR" --target ES2020 --module commonjs --esModuleInterop --skipLibCheck; then
        print_message $GREEN "✅ $name 编译成功"
    else
        print_message $RED "❌ $name 编译失败"
        return 1
    fi
}

# 运行单个测试
run_single_test() {
    local test_file=$1
    local test_name=$2
    
    print_title "运行 $test_name"
    
    local js_file="${test_file%.ts}.js"
    
    if [[ ! -f "$js_file" ]]; then
        print_message $RED "❌ 编译后的文件不存在: $js_file"
        return 1
    fi
    
    print_message $BLUE "🚀 正在执行 $test_name..."
    
    if node "$js_file"; then
        print_message $GREEN "✅ $test_name 执行成功"
        return 0
    else
        print_message $RED "❌ $test_name 执行失败"
        return 1
    fi
}

# 运行DAL层测试
run_dal_test() {
    compile_typescript "$TEST_SCRIPT_DIR/dal_crud_testAll.ts" "DAL层测试"
    run_single_test "$TEST_SCRIPT_DIR/dal_crud_testAll.ts" "DAL层CRUD测试"
}

# 运行控制器层测试
run_controller_test() {
    compile_typescript "$TEST_SCRIPT_DIR/controller_crud_testAll.ts" "控制器层测试"
    run_single_test "$TEST_SCRIPT_DIR/controller_crud_testAll.ts" "控制器层CRUD测试"
}

# 运行API层测试
run_api_test() {
    print_message $YELLOW "⚠️ API测试需要服务器运行，请确保服务器已启动"
    read -p "服务器是否已启动？(y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_message $YELLOW "请先启动服务器，然后重新运行API测试"
        print_message $BLUE "启动命令: npm run dev"
        return 1
    fi
    
    compile_typescript "$TEST_SCRIPT_DIR/api_crud_testAll.ts" "API层测试"
    run_single_test "$TEST_SCRIPT_DIR/api_crud_testAll.ts" "API层CRUD测试"
}

# 运行综合测试
run_comprehensive_test() {
    compile_typescript "$TEST_SCRIPT_DIR/run_all_crud_tests.ts" "综合测试"
    run_single_test "$TEST_SCRIPT_DIR/run_all_crud_tests.ts" "三层架构CRUD综合测试"
}

# 显示帮助信息
show_help() {
    echo "三层架构CRUD测试执行脚本"
    echo
    echo "使用方法:"
    echo "  $0 [选项]"
    echo
    echo "选项:"
    echo "  dal         仅运行DAL层测试"
    echo "  controller  仅运行控制器层测试"
    echo "  api         仅运行API层测试"
    echo "  all         运行综合测试（默认）"
    echo "  help        显示此帮助信息"
    echo
    echo "示例:"
    echo "  $0              # 运行综合测试"
    echo "  $0 dal          # 仅运行DAL层测试"
    echo "  $0 controller   # 仅运行控制器层测试"
    echo "  $0 api          # 仅运行API层测试"
    echo
}

# 显示测试结果摘要
show_summary() {
    print_title "测试执行摘要"
    
    if [[ -f "$TEST_REPORT_DIR/comprehensive_crud_test_report.md" ]]; then
        print_message $GREEN "📄 综合测试报告: $TEST_REPORT_DIR/comprehensive_crud_test_report.md"
    fi
    
    if [[ -f "$TEST_REPORT_DIR/dal_crud_test_report.md" ]]; then
        print_message $GREEN "📄 DAL层测试报告: $TEST_REPORT_DIR/dal_crud_test_report.md"
    fi
    
    if [[ -f "$TEST_REPORT_DIR/controller_crud_test_report.md" ]]; then
        print_message $GREEN "📄 控制器层测试报告: $TEST_REPORT_DIR/controller_crud_test_report.md"
    fi
    
    if [[ -f "$TEST_REPORT_DIR/api_crud_test_report.md" ]]; then
        print_message $GREEN "📄 API层测试报告: $TEST_REPORT_DIR/api_crud_test_report.md"
    fi
    
    print_message $BLUE "💡 查看详细报告请打开上述文件"
}

# 主函数
main() {
    local test_type=${1:-"all"}
    
    case $test_type in
        "help")
            show_help
            exit 0
            ;;
        "dal")
            check_prerequisites
            check_typescript
            setup_directories
            if run_dal_test; then
                print_message $GREEN "🎉 DAL层测试完成！"
            else
                print_message $RED "❌ DAL层测试失败！"
                exit 1
            fi
            ;;
        "controller")
            check_prerequisites
            check_typescript
            setup_directories
            if run_controller_test; then
                print_message $GREEN "🎉 控制器层测试完成！"
            else
                print_message $RED "❌ 控制器层测试失败！"
                exit 1
            fi
            ;;
        "api")
            check_prerequisites
            check_typescript
            setup_directories
            if run_api_test; then
                print_message $GREEN "🎉 API层测试完成！"
            else
                print_message $RED "❌ API层测试失败！"
                exit 1
            fi
            ;;
        "all")
            check_prerequisites
            check_typescript
            setup_directories
            if run_comprehensive_test; then
                print_message $GREEN "🎉 综合测试完成！"
            else
                print_message $RED "❌ 综合测试失败！"
                exit 1
            fi
            ;;
        *)
            print_message $RED "❌ 未知的测试类型: $test_type"
            show_help
            exit 1
            ;;
    esac
    
    show_summary
}

# 脚本入口
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi